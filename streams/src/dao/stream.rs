use crate::models::Stream;
use async_trait::async_trait;
use errors::dao::DAOError;
use futures::stream::StreamExt;
use mongodb::{bson::doc, Collection, Database};

#[async_trait]
pub trait StreamDAOExt {
    //Temporary dev function until feeds service is ready
    async fn dev_get_feed(&self) -> Vec<Stream>;

    async fn create(&self, stream: Stream) -> Result<(), DAOError>;
    async fn delete(&self, id: &str) -> Result<(), DAOError>;
    async fn get(&self, id: &str) -> Option<Stream>;
    async fn rename(&self, id: &str, name: &str) -> Result<(), DAOError>;
    async fn is_user_live(&self, user_id: &str) -> bool;
}

pub struct StreamDAO {
    collection: Option<Collection<Stream>>,
}

impl StreamDAO {
    pub fn new() -> Self {
        Self { collection: None }
    }

    pub async fn connect(&mut self, db: &Database) {
        self.collection = Some(db.collection_with_type::<Stream>("streams"));
    }
}

#[async_trait]
impl StreamDAOExt for StreamDAO {
    //Temporary dev function until feeds service is ready
    async fn dev_get_feed(&self) -> Vec<Stream> {
        let result: Vec<mongodb::error::Result<Stream>> = self
            .collection
            .as_ref()
            .unwrap()
            .find(doc! {}, None)
            .await
            .unwrap()
            .collect()
            .await;

        result
            .iter()
            .filter(|i| i.is_ok())
            .map(|i| i.as_ref().unwrap().clone())
            .collect()
    }

    async fn create(&self, stream: Stream) -> Result<(), DAOError> {
        let collection = self.collection.as_ref().unwrap();

        match collection.insert_one(stream, None).await {
            Ok(_) => Ok(()),
            Err(_) => Err(DAOError::Insert),
        }
    }

    async fn delete(&self, id: &str) -> Result<(), DAOError> {
        let collection = self.collection.as_ref().unwrap();

        match collection
            .delete_one(
                doc! {
                    "id": id
                },
                None,
            )
            .await
        {
            Ok(_) => Ok(()),
            Err(_) => Err(DAOError::Delete),
        }
    }

    async fn get(&self, id: &str) -> Option<Stream> {
        let collection = self.collection.as_ref().unwrap();

        collection
            .find_one(
                doc! {
                    "id": id
                },
                None,
            )
            .await
            .unwrap()
    }

    async fn rename(&self, id: &str, name: &str) -> Result<(), DAOError> {
        let collection = self.collection.as_ref().unwrap();

        let update_result = collection
            .update_one(
                doc! {"id": id},
                doc! {"$set": doc! {
                    "name": name
                }},
                None,
            )
            .await;

        match update_result {
            Ok(result) => {
                if result.matched_count == 0 {
                    Err(DAOError::NotFound)
                } else {
                    Ok(())
                }
            }
            Err(_) => Err(DAOError::Update),
        }
    }

    async fn is_user_live(&self, user_id: &str) -> bool {
        let collection = self.collection.as_ref().unwrap();

        collection
            .find_one(
                Some(doc! {
                    "owner": user_id,
                    "live": true
                }),
                None,
            )
            .await
            .unwrap()
            .is_some()
    }
}
