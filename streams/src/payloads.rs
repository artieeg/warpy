use serde::Deserialize;

#[derive(Deserialize)]
pub struct CreateStreamPayload {
    title: String,
    hub: String,
}
