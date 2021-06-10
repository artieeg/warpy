use super::refresh_token::RefreshTokenDAOExt;
use super::user::UserDAOExt;
use crate::errors::dao::*;
use crate::models::{RefreshToken, User};
use async_trait::async_trait;
use mockall::mock;

mock! {
    pub RefreshTokenDAO {  }
    #[async_trait]
    impl RefreshTokenDAOExt for RefreshTokenDAO {
        async fn add_token(&self, token: RefreshToken) -> Result<(), DAOError>;
        async fn del_token(&self, owner: &str) -> Result<(), DAOError>;
    }
}

#[cfg(test)]
mock! {
    pub UserDAO {  }
    #[async_trait]
    impl UserDAOExt for UserDAO {
        async fn add_user(&self, user: User) -> Result<(), DAOError>;
        async fn find_user(&self, username: &str, email: &str) -> Option<User>;
        async fn get_user(&self, id: &str) -> Option<User>;
        async fn del_user(&self, id: &str) -> Result<(), DAOError>;
        async fn update(&self, id: &str, updated_user: User) -> Result<(), DAOError>;
    }
}
