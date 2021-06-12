use async_trait::async_trait;
use crate::models::Stream;
use mongodb::{Collection, Database};

#[async_trait]
pub trait HubDAOExt {
    async fn get_all(&self) -> Option<Vec<Stream>>;
    async fn exists(&self, id: &str) -> bool;
}

pub struct HubDAO {
    collection: Option<Collection<Stream>>,
}

impl HubDAO {
    pub fn new() -> Self {
        Self { collection: None }
    }

    pub async fn connect(&mut self, db: &Database) {
        self.collection = Some(db.collection_with_type::<Stream>("streams"));
    }
}

#[async_trait]
impl HubDAOExt for HubDAO {
    async fn get_all(&self) -> Option<Vec<Stream>> {
        unimplemented!();
    }

    async fn exists(&self, id: &str) -> bool {
        unimplemented!();
    }
}
