use crate::dao::*;

pub struct Context {
    pub user_dao: UserDAO,
    pub refresh_token_dao: RefreshTokenDAO
}

impl Context {
    pub fn create(user_dao: UserDAO, refresh_token_dao: RefreshTokenDAO) -> Self {
        Self {
            user_dao,
            refresh_token_dao
        }
    }
}

impl Clone for Context {
    fn clone(&self) -> Self {
        Self {
            user_dao: self.user_dao.clone(),
            refresh_token_dao: self.refresh_token_dao.clone()
        }
    }
}
