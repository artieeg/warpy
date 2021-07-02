use std::time::{SystemTime, UNIX_EPOCH};

use crate::payloads::CreateStreamPayload;
use nanoid::nanoid;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct User {
    pub id: String,
    pub avatar: String,
    pub username: String,
    pub first_name: String,
    pub last_name: String,
}
