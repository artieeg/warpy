use super::refresh_token::RefreshTokenDAOExt;
use super::user::UserDAOExt;
use errors::dao::*;
use crate::models::{RefreshToken, User};
use async_trait::async_trait;
use mockall::mock;

mock! {
    pub RefreshTokenDAO {  }
    #[async_trait]
    impl RefreshTokenDAOExt for RefreshTokenDAO {
        async fn create(&self, token: RefreshToken) -> Result<(), DAOError>;
        async fn delete(&self, owner: &str) -> Result<(), DAOError>;
        async fn get(&self, token: &str) -> Option<RefreshToken>;
    }
}

#[cfg(test)]
mock! {
    pub UserDAO {  }
    #[async_trait]
    impl UserDAOExt for UserDAO {
        fn create(&self, user: User) -> Result<(), DAOError>;
        async fn find(&self, username: &str, email: &str) -> Option<User>;
        async fn check_username(&self, username: &str) -> Result<(), DAOError>;
        async fn get(&self, id: &str) -> Option<User>;
        async fn delete(&self, id: &str) -> Result<(), DAOError>;
        async fn update(&self, updated_user: User) -> Result<(), DAOError>;
    }
}
