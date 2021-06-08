use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct CreateWithPassword {
    pub first_name: String,
    pub last_name: String,
    pub username: String,
    pub password: String,
    pub avatar: String,
    pub email: String
}
