use std::time::{SystemTime, UNIX_EPOCH};

use crate::payloads::CreateStreamPayload;
use nanoid::nanoid;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Stream {
    pub id: String,
    pub owner: String,
    pub hub: String,
    pub live: bool,
    pub title: String,
    pub created_at: u128,
}

impl Stream {
    pub fn from_payload(payload: CreateStreamPayload, owner: &str) -> Self {
        Self {
            id: nanoid!(),
            owner: owner.to_string(),
            hub: payload.hub,
            title: payload.title,
            live: true,
            created_at: SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_millis(),
        }
    }
}
