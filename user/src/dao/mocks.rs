use super::refresh_token::RefreshTokenDAOExt;
use super::user::UserDAOExt;
use crate::errors::dao::DAOInsertError;
use crate::models::{RefreshToken, User};
use async_trait::async_trait;
use mockall::mock;

mock! {
    pub RefreshTokenDAO {  }
    #[async_trait]
    impl RefreshTokenDAOExt for RefreshTokenDAO {
        async fn add_token(&self, token: RefreshToken) -> Result<(), DAOInsertError>;
    }
}

#[cfg(test)]
mock! {
    pub UserDAO {  }
    #[async_trait]
    impl UserDAOExt for UserDAO {
        async fn add_user<'a>(&'a self, user: User) -> Result<(), DAOInsertError>;
        async fn find_user<'a>(&'a self, username: &'a str, email: &'a str) -> Option<User>;
        async fn get_user<'a>(&'a self, id: &'a str) -> Option<User>;
    }
}
