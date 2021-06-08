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

/*
impl<U: UserDAOExt + Clone, R: RefreshTokenDAOExt + Clone> Clone for Context<U, R> {
    fn clone(&self) -> Self {
        Self {
            user_dao: self.user_dao.clone(),
            refresh_token_dao: self.refresh_token_dao.clone()
        }
    }
}
*/

//pub type WarpyContext = Context<UserDAO, RefreshTokenDAO>;
