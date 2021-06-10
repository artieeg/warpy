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

#[derive(Deserialize, Serialize, Debug)]
pub struct UpdateUser {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub username: Option<String>,
    pub avatar: Option<String>,
}
