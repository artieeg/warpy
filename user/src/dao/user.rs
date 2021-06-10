use crate::errors::dao::DAOError;
use crate::models::User;
use mongodb::bson;
use mongodb::options::UpdateModifications;
use mongodb::{bson::doc, Collection, Database};

use async_trait::async_trait;

#[async_trait]
pub trait UserDAOExt {
    async fn add_user(&self, user: User) -> Result<(), DAOError>;
    async fn find_user(&self, username: &str, email: &str) -> Option<User>;
    async fn check_username(&self, username: &str) -> Result<(), DAOError>;
    async fn get_user(&self, id: &str) -> Option<User>;
    async fn del_user(&self, id: &str) -> Result<(), DAOError>;
    async fn update(&self, updated_user: User) -> Result<(), DAOError>;
}

pub struct UserDAO {
    collection: Option<Collection<User>>,
}

impl UserDAO {
    pub fn new() -> Self {
        Self { collection: None }
    }

    pub async fn connect(&mut self, db: &Database) {
        self.collection = Some(db.collection_with_type::<User>("users"));
    }
}

#[async_trait]
impl UserDAOExt for UserDAO {
    async fn add_user(&self, user: User) -> Result<(), DAOError> {
        let collection = self.collection.as_ref().unwrap();

        match collection.insert_one(user, None).await {
            Ok(_) => Ok(()),
            Err(_) => return Err(DAOError::Insert),
        }
    }

    async fn check_username(&self, username: &str) -> Result<(), DAOError> {
        let collection = self.collection.as_ref().unwrap();

        let result = collection
            .find_one(
                doc! {"username": username},
                None,
            )
            .await
            .unwrap();

        match result {
            Some(user) => Err(DAOError::AlreadyExists("username")),
            None => Ok(())
        }
    }

    async fn find_user(&self, username: &str, email: &str) -> Option<User> {
        let collection = self.collection.as_ref().unwrap();

        collection
            .find_one(
                doc! {
                    "$or": vec![
                        doc! {"username": username},
                        doc! {"email": email},
                    ]
                },
                None,
            )
            .await
            .unwrap()
    }

    async fn get_user(&self, id: &str) -> Option<User> {
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

    async fn del_user(&self, id: &str) -> Result<(), DAOError> {
        let collection = self.collection.as_ref().unwrap();

        let delete_result = collection
            .delete_one(
                doc! {
                    "id": id
                },
                None,
            )
            .await;

        match delete_result {
            Ok(result) => {
                if result.deleted_count != 1 {
                    Err(DAOError::NotFound)
                } else {
                    Ok(())
                }
            }
            Err(_) => Err(DAOError::Delete),
        }
    }

    async fn update(&self, updated_user: User) -> Result<(), DAOError> {
        let id = updated_user.id.as_str();
        let collection = self.collection.as_ref().unwrap();

        let update_result = collection.update_one(
            doc! {"id": id},
            doc! {"$set": bson::to_bson(&updated_user).unwrap()},
            None,
        ).await;

        match update_result {
            Ok(result) => {
                if result.matched_count == 0 {
                    Err(DAOError::NotFound)
                } else {
                    Ok(())
                }
            },
            Err(_) => Err(DAOError::Update)
        }
    }
}
