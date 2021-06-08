use crate::errors::dao::DAOInsertError;
use crate::models::RefreshToken;
use mongodb::{error::Error, Database, Collection};

use async_trait::async_trait;

#[cfg(test)]
use mockall::automock;

#[async_trait]
#[cfg_attr(test, automock)]
pub trait RefreshTokenDAOExt {
    async fn add_token(&self, token: RefreshToken) -> Result<(), DAOInsertError>;
}

#[derive(Clone)]
pub struct RefreshTokenDAO {
    collection: Option<Collection<RefreshToken>>,
}

#[cfg_attr(test, automock)]
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
    async fn add_token(&self, token: RefreshToken) -> Result<(), DAOInsertError> {
        let collection = self.collection.as_ref().unwrap();

        match collection.insert_one(token, None).await {
            Ok(_) => Ok(()),
            Err(_) => return Err(DAOInsertError {}),
        }
    }
}
