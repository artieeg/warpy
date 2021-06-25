use super::*;
use errors::dao::*;
use crate::models::{Hub, Stream};
use async_trait::async_trait;
use mockall::mock;

mock! {
    pub StreamDAO {  }
    #[async_trait]
    impl StreamDAOExt for StreamDAO {
        async fn create(&self, stream: Stream) -> Result<String, DAOError>;
        async fn delete(&self, id: &str) -> Result<(), DAOError>;
        async fn get(&self, id: &str) -> Option<Stream>;
        async fn rename(&self, id: &str, name: &str) -> Result<(), DAOError>;
        async fn is_user_live(&self, user_id: &str) -> bool;
    }
}

#[cfg(test)]
mock! {
    pub HubDAO {  }
    #[async_trait]
    impl HubDAOExt for HubDAO {
        async fn get_all(&self) -> Vec<Stream>;
        async fn exists(&self, id: &str) -> bool;
    }
}
