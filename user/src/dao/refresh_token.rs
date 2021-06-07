use crate::errors::dao::DAOInsertError;
use crate::models::RefreshToken;
use mongodb::{error::Error, Database, Collection};

#[derive(Clone)]
pub struct RefreshTokenDAO {
    collection: Collection<RefreshToken>,
}

impl RefreshTokenDAO {
    pub async fn new(db: &Database) -> Result<Self, Error> {
        Ok(Self {
            collection: db.collection_with_type::<RefreshToken>("refresh_tokens"),
        })
    }

    pub async fn add_token(&self, token: RefreshToken) -> Result<String, DAOInsertError> {
        match self.collection.insert_one(token, None).await {
            Ok(result) => Ok(result.inserted_id.to_string()),
            Err(_) => return Err(DAOInsertError {}),
        }
    }
}
