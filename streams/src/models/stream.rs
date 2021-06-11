use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct Stream {
    id: String, 
    owner: String,
    hub: String
}
