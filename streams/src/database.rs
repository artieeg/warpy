use mongodb::{options::ClientOptions, Client};
use crate::dao::*;
pub struct Database;

impl Database {
    pub async fn connect() -> (StreamDAO, HubDAO) {
        let mongo_conn = std::env::var("MONGODB_CONN").unwrap();
        let options = ClientOptions::parse(mongo_conn.as_str()).await.unwrap();
        let client = Client::with_options(options).unwrap();

        let db = client.database("warpy");

        let mut stream_dao = StreamDAO::new();
        stream_dao.connect(&db).await;

        let mut hub_dao = HubDAO::new();
        hub_dao.connect(&db).await;

        (stream_dao, hub_dao)
    }
}
