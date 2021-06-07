use crate::models::User;
use jsonwebtoken::{decode, Validation, encode, errors::Error, EncodingKey, DecodingKey, Header};
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use std::env::var;
use std::time::{SystemTime, UNIX_EPOCH};

lazy_static! {
    static ref JWT_SECRET: String = var("JWT_SECRET").unwrap();
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Claims {
    pub sub: String,

    pub iss: String,
    pub iat: u64,
}

impl Claims {
    fn from_string(claims: String) -> Result<Claims, Error> {
        let v = Validation::default();
        let result = decode::<Claims>(
            &claims,
            &DecodingKey::from_secret(&*JWT_SECRET.as_bytes()),
            &v,
        );

        match result {
            Ok(data) => Ok(data.claims),
            Err(e) => Err(e)
        }
    }

    fn new(user: User) -> Result<String, Error> {
        let claims = Claims {
            sub: user.id,
            iss: String::from("warpy.tv"),
            iat: SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_secs(),
        };

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(&*JWT_SECRET.as_bytes()),
        )
    }
}
