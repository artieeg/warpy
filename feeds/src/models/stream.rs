use serde::{Deserialize, Serialize};
use super::User;

#[derive(Serialize, Deserialize)]
pub struct Stream {
    id: String,
    user: User,
    hub: String,
    created_at: u128
}
