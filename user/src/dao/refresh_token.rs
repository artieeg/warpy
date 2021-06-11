use crate::errors::dao::*;
use crate::models::RefreshToken;
use mongodb::{Database, bson::doc, Collection};

use async_trait::async_trait;

#[async_trait]
pub trait RefreshTokenDAOExt {
    async fn create(&self, token: RefreshToken) -> Result<(), DAOError>;
    async fn delete(&self, owner: &str) -> Result<(), DAOError>;
    async fn get(&self, token: &str) -> Option<RefreshToken>;
}

pub struct RefreshTokenDAO {
    collection: Option<Collection<RefreshToken>>,
}

impl RefreshTokenDAO {
    pub fn new() -> Self {
        Self {
            collection: None
        }
    }

    pub async fn connect(&mut self, db: &Database) {
        self.collection = Some(db.collection_with_type::<RefreshToken>("refresh_tokens"));
    }
}

#[async_trait]
impl RefreshTokenDAOExt for RefreshTokenDAO {
    async fn create(&self, token: RefreshToken) -> Result<(), DAOError> {
        let collection = self.collection.as_ref().unwrap();

        match collection.insert_one(token, None).await {
            Ok(_) => Ok(()),
            Err(_) => return Err(DAOError::Insert),
        }
    }

    async fn delete(&self, owner: &str) -> Result<(), DAOError> {
        unimplemented!();
    }

    async fn get(&self, token: &str) -> Option<RefreshToken> {
        let collection = self.collection.as_ref().unwrap();

        collection.find_one(doc! {
            "token": token
        }, None).await.unwrap()
    }
}
