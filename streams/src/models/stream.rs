use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Stream {
    pub id: String, 
    pub owner: String,
    pub hub: String,
    pub live: bool,
    pub title: String
}
