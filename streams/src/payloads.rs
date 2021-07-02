use serde::{Deserialize, Serialize};
use crate::models::User;

#[derive(Deserialize)]
pub struct CreateStreamPayload {
    pub title: String,
    pub hub: String,
}

#[derive(Deserialize)]
pub struct DeleteStreamPayload {
    pub id: String,
}

#[derive(Serialize)]
pub struct AMQPEventNewStream {
    pub id: String,
    pub hub: String,
    pub owner: User,
}
