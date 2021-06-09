use mongodb::{options::ClientOptions, Client};
use crate::dao::*;
pub struct Database;

impl Database {
    pub async fn connect() -> (UserDAO, RefreshTokenDAO) {
        let mongo_conn = std::env::var("MONGODB_CONN").unwrap();
        let options = ClientOptions::parse(mongo_conn.as_str()).await.unwrap();
        let client = Client::with_options(options).unwrap();

        let db = client.database("warpy");

        let mut user_dao = UserDAO::new();
        user_dao.connect(&db).await;

        let mut refresh_token_dao = RefreshTokenDAO::new();
        refresh_token_dao.connect(&db).await;

        (user_dao, refresh_token_dao)
    }
}
