use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Stream {
    id: String, 
    owner: String,
    hub: String,
    live: bool
}
