use async_trait::async_trait;
use crate::models::Stream;

#[async_trait]
pub trait FeedDAOExt {
    async fn get() -> Vec<Stream>;
}

pub struct FeedDAO;

impl FeedDAO {
    pub fn new() -> Self {
        Self {}
    }
}

#[async_trait]
impl FeedDAOExt for FeedDAO {
    async fn get() -> Vec<Stream> {
        vec![]
    }
}
