use async_trait::async_trait;
use errors::dao::DAOError;
use redis::aio::Connection;
use redis::Client;
use redis::ConnectionInfo;

use crate::models::Stream;

#[async_trait]
pub trait FeedCandidateDAOExt {
    async fn connect(&mut self);
    async fn add(&self, stream: Stream) -> Result<(), DAOError>;
    async fn remove(&self, stream_id: &str) -> Result<(), DAOError>;
}

pub struct FeedCandidateDAO {
    connection: Option<Connection>,
}

impl FeedCandidateDAO {
    pub fn new() -> Self {
        Self { connection: None }
    }

    pub fn get_connection(&self) -> &Connection {
        self.connection.as_ref().unwrap()
    }
}

#[async_trait]
impl FeedCandidateDAOExt for FeedCandidateDAO {
    async fn connect(&mut self) {
        let redis_uri = std::env::var("REDIS_URI").expect("redis uri env variable");
        let client = Client::open(redis_uri.as_str()).expect("opening redis client");

        self.connection = Some(
            client
                .get_async_connection()
                .await
                .expect("connect to redis"),
        );
    }

    async fn add(&self, _stream: Stream) -> Result<(), DAOError> {
        unimplemented!();
    }

    async fn remove(&self, _stream_id: &str) -> Result<(), DAOError> {
        unimplemented!();
    }
}
