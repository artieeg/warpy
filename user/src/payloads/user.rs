use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateDev {
    pub first_name: String,
    pub last_name: String,
    pub username: String,
    pub email: String,
    pub avatar: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct UpdateUser {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub username: Option<String>,
    pub avatar: Option<String>,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct AMQPGet {
    pub id: String,
}
