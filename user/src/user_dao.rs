use mongodb::{Client, error::Error, options::ClientOptions, Collection};
use crate::User;

#[derive(Clone)]
pub struct UserDAO {
    collection: Collection<User>
}

impl UserDAO {
    pub async fn new() -> Result<Self, Error> {
        let mongo_conn = std::env::var("MONGODB_CONN").unwrap();
        let options = ClientOptions::parse(mongo_conn.as_str()).await?;
        let client = Client::with_options(options)?;

        let db = client.database("warpy");

        Ok(Self {
            collection: db.collection_with_type::<User>("users")
        })
    }
}
