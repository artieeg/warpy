use crate::UserDAO;

pub struct Context {
    pub user_dao: UserDAO
}

impl Context {
    pub fn create(user_dao: UserDAO) -> Self {
        Self {
            user_dao
        }
    }
}

impl Clone for Context {
    fn clone(&self) -> Self {
        Self {
            user_dao: self.user_dao.clone()
        }
    }
}
