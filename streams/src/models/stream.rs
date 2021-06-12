use serde::{Serialize, Deserialize};
use crate::payloads::CreateStreamPayload;
use nanoid::nanoid;

#[derive(Serialize, Deserialize, Debug)]
pub struct Stream {
    pub id: String, 
    pub owner: String,
    pub hub: String,
    pub live: bool,
    pub title: String
}

impl Stream {
    pub fn from_payload(payload: CreateStreamPayload, owner: &str) -> Self {
        Self {
            id: nanoid!(),
            owner: owner.to_string(),
            hub: payload.hub,
            title: payload.title,
            live: true,
        }
    }
}
