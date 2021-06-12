use crate::dao::{user::*, refresh_token::*};

pub struct WarpyContext<U: UserDAOExt, R: RefreshTokenDAOExt> {
    pub user_dao: U,
    pub refresh_token_dao: R
}

impl<U: UserDAOExt, R: RefreshTokenDAOExt> WarpyContext<U, R> {
    pub fn create(user_dao: U, refresh_token_dao: R) -> Self {
        Self {
            user_dao,
            refresh_token_dao
        }
    }
}
