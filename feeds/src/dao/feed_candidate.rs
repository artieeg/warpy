use async_trait::async_trait;
use errors::dao::DAOError;

use crate::models::Stream;

#[async_trait]
pub trait FeedCandidateDAOExt {
    async fn add(stream: Stream) -> Result<(), DAOError>;
    async fn remove(stream_id: &str) -> Result<(), DAOError>;
}

pub struct FeedCandidateDAO {}

#[async_trait]
impl FeedCandidateDAOExt for FeedCandidateDAO {
    async fn add(_stream: Stream) -> Result<(), DAOError> {
        unimplemented!();
    }

    async fn remove(_stream_id: &str) -> Result<(), DAOError> {
        unimplemented!();
    }
}

