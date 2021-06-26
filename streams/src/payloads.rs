use serde::Deserialize;

#[derive(Deserialize)]
pub struct CreateStreamPayload {
    pub title: String,
    pub hub: String,
}

#[derive(Deserialize)]
pub struct DeleteStreamPayload {
    pub id: String,
}
