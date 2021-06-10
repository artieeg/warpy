use crate::errors::dao::DAOError;
use crate::models::User;
use mongodb::{bson::doc, Collection, Database};

use async_trait::async_trait;

#[async_trait]
pub trait UserDAOExt {
    async fn add_user(&self, user: User) -> Result<(), DAOError>;
    async fn find_user(&self, username: &str, email: &str) -> Option<User>;
    async fn get_user(&self, id: &str) -> Option<User>;
    async fn del_user(&self, id: &str) -> Result<(), DAOError>;
    async fn update(&self, id: &str, updated_user: User) -> Result<(), DAOError>;
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
        unimplemented!();
    }

    async fn update(&self, id: &str, updated_user: User) -> Result<(), DAOError> {
        unimplemented!();
    }
}
