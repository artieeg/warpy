use mongodb::{options::ClientOptions, Client};
use crate::dao::*;
pub struct Database;

impl Database {
    pub async fn connect() -> StreamDAO {
        let mongo_conn = std::env::var("MONGODB_CONN").unwrap();
        let options = ClientOptions::parse(mongo_conn.as_str()).await.unwrap();
        let client = Client::with_options(options).unwrap();

        let db = client.database("warpy");

        let mut stream_dao = StreamDAO::new();
        stream_dao.connect(&db).await;

        stream_dao
    }
}
