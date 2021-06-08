use crate::errors::dao::DAOInsertError;
use crate::models::User;
use mongodb::{error::Error, Database, Collection, bson::doc};

use async_trait::async_trait;

#[cfg(test)]
use mockall::{automock, mock};

#[async_trait]
#[cfg_attr(test, automock)]
pub trait UserDAOExt {
    async fn add_user<'a>(&'a self, user: User) -> Result<(), DAOInsertError>;
    async fn find_user<'a>(&'a self, username: &'a str, email: &'a str) -> Option<User>;
    async fn get_user<'a>(&'a self, id: &'a str) -> Option<User>;
}

#[derive(Clone)]
pub struct UserDAO {
    collection: Option<Collection<User>>,
}

#[cfg_attr(test, automock)]
impl UserDAO {
    pub fn new() -> Self {
        Self {
            collection: None
        }
    }

    pub async fn connect(&mut self, db: &Database) {
        self.collection = Some(db.collection_with_type::<User>("users"));
    }
}

#[async_trait]
impl UserDAOExt for UserDAO {
    async fn add_user<'a>(&'a self, user: User) -> Result<(), DAOInsertError> {
        let collection = self.collection.as_ref().unwrap();

        match collection.insert_one(user, None).await {
            Ok(_) => Ok(()),
            Err(_) => return Err(DAOInsertError {}),
        }
    }

    async fn find_user<'a>(&'a self, username: &'a str, email: &'a str) -> Option<User> {
        let collection = self.collection.as_ref().unwrap();
        
        collection.find_one(doc! {
            "$or": vec![
                doc! {"username": username},
                doc! {"email": email},
            ]
        }, None).await.unwrap()
    }

    async fn get_user<'a>(&'a self, id: &'a str) -> Option<User> {
        let collection = self.collection.as_ref().unwrap();

        collection.find_one(doc! {
            "id": id
        }, None).await.unwrap()
    }
}
