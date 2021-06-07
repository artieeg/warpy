use crate::errors::dao::DAOInsertError;
use crate::models::User;
use mongodb::{error::Error, Database, Collection};

#[derive(Clone)]
pub struct UserDAO {
    collection: Collection<User>,
}

impl UserDAO {
    pub async fn new(db: &Database) -> Result<Self, Error> {
        Ok(Self {
            collection: db.collection_with_type::<User>("users"),
        })
    }

    pub async fn add_user(&self, user: User) -> Result<String, DAOInsertError> {
        match self.collection.insert_one(user, None).await {
            Ok(result) => Ok(result.inserted_id.to_string()),
            Err(_) => return Err(DAOInsertError {}),
        }
    }
}
