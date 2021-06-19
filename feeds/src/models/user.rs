use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct User {
    id: String,
    username: String,
    first_name: String,
    last_name: String,
    avatar: String
} 
