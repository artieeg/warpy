use crate::errors::dao::*;
use crate::models::RefreshToken;
use mongodb::{Database, Collection};

use async_trait::async_trait;

#[async_trait]
pub trait RefreshTokenDAOExt {
    async fn add_token(&self, token: RefreshToken) -> Result<(), DAOError>;
    async fn del_token(&self, owner: &str) -> Result<(), DAOError>;
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
    async fn add_token(&self, token: RefreshToken) -> Result<(), DAOError> {
        let collection = self.collection.as_ref().unwrap();

        match collection.insert_one(token, None).await {
            Ok(_) => Ok(()),
            Err(_) => return Err(DAOError::Insert),
        }
    }

    async fn del_token(&self, owner: &str) -> Result<(), DAOError> {
        unimplemented!();
    }
}
