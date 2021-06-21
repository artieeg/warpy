use serde::{Deserialize, Serialize};
use super::User;

#[derive(Serialize, Deserialize)]
pub struct Stream {
    pub id: String,
    pub user: User,
    pub hub: String,
    pub created_at: u128
}
