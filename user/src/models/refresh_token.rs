use serde::{Serialize, Deserialize};

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct RefreshToken {
    pub token: String,
    pub user_id: String
}

impl RefreshToken {
    pub fn new(user_id: &String, token: &String) -> Self {
        Self {
            user_id: user_id.clone(),
            token: token.clone()
        }
    }
}
