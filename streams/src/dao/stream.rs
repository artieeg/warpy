use async_trait::async_trait;
use errors::dao::DAOError;
use crate::models::Stream;
use mongodb::{Collection, Database};

#[async_trait]
pub trait StreamDAOExt {
    async fn create(&self, stream: Stream) -> Result<(), DAOError>;
    async fn delete(&self, id: &str) -> Result<(), DAOError>;
    async fn get(&self, id: &str) -> Option<Stream>;
    async fn rename(&self, id: &str, name: &str) -> Option<Stream>;
    async fn is_user_live(&self, user_id: &str) -> bool;
}

pub struct StreamDAO {
    collection: Option<Collection<Stream>>,
}

impl StreamDAO {
    pub fn new() -> Self {
        Self { collection: None }
    }

    pub async fn connect(&mut self, db: &Database) {
        self.collection = Some(db.collection_with_type::<Stream>("streams"));
    }
}

#[async_trait]
impl StreamDAOExt for StreamDAO {
    async fn create(&self, stream: Stream) -> Result<(), DAOError> {
        unimplemented!();
    }

    async fn delete(&self, id: &str) -> Result<(), DAOError> {
        unimplemented!();
    }

    async fn get(&self, id: &str) -> Option<Stream> {
        unimplemented!();
    }

    async fn rename(&self, id: &str, name: &str) -> Option<Stream> {
        unimplemented!();
    }

    async fn is_user_live(&self, user_id: &str) -> bool {
        unimplemented!();
    }
}
