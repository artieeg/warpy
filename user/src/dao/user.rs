use crate::errors::dao::DAOInsertError;
use crate::models::User;
use mongodb::{error::Error, Database, Collection, bson::doc};

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

    pub async fn find_user(&self, username: &str, email: &str) -> Option<User> {
        self.collection.find_one(doc! {
            "$or": vec![
                doc! {"username": username},
                doc! {"email": email},
            ]
        }, None).await.unwrap()
    }

    pub async fn get_user(&self, id: &str) -> Option<User> {
        self.collection.find_one(doc! {
            "id": id
        }, None).await.unwrap()
    }
}
