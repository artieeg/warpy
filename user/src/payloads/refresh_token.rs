use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct TokenRefreshPayload {
    pub token: String
} 
