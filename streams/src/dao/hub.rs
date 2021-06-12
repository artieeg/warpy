use crate::models::Stream;
use async_trait::async_trait;
use futures::stream::StreamExt;
use mongodb::{error::Result, Collection, Database};
use serde_json::json;

#[async_trait]
pub trait HubDAOExt {
    async fn get_all(&self) -> Vec<Stream>;
    async fn exists(&self, id: &str) -> bool;
}

pub struct HubDAO {
    collection: Option<Collection<Stream>>,
}

impl HubDAO {
    pub fn new() -> Self {
        Self { collection: None }
    }

    pub async fn connect(&mut self, db: &Database) {
        self.collection = Some(db.collection_with_type::<Stream>("streams"));
    }
}

#[async_trait]
impl HubDAOExt for HubDAO {
    async fn get_all(&self) -> Vec<Stream> {
        let collection = self.collection.as_ref().unwrap();

        let result: Vec<Result<Stream>> =
            collection.find(None, None).await.unwrap().collect().await;

        result
            .into_iter()
            .filter(|r| r.is_ok())
            .map(|r| r.unwrap())
            .collect()
    }

    async fn exists(&self, id: &str) -> bool {
        unimplemented!();
    }
}
