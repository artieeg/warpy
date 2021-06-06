use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    id: String,
    first_name: String,
    last_name: String,
    username: String,
    hashed_password: String,
    avatar: String,
    avatar_blurhash: String
}
