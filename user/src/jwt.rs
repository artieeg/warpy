use crate::models::User;
use jsonwebtoken::{decode, encode, errors::Error, DecodingKey, EncodingKey, Header, Validation};
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use std::env::var;
use std::time::{SystemTime, UNIX_EPOCH};

lazy_static! {
    static ref SECRET: String = var("JWT_SECRET").unwrap();
    static ref ACCESS_EXP: u64 = var("JWT_ACCESS_EXP_SECONDS").unwrap().parse().unwrap();
    static ref REFRESH_EXP: u64 = var("JWT_REFRESH_EXP_SECONDS").unwrap().parse().unwrap();
}

pub enum TokenType {
    Refresh,
    Access,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Claims {
    pub sub: String,

    pub iss: String,
    pub iat: u64,
    pub exp: u64,
}

impl Claims {
    pub fn from_string(claims_string: &str) -> Result<Claims, Error> {
        let v = Validation::default();
        let result = decode::<Claims>(
            &claims_string,
            &DecodingKey::from_secret(&*SECRET.as_bytes()),
            &v,
        );

        match result {
            Ok(data) => Ok(data.claims),
            Err(e) => Err(e),
        }
    }

    pub fn new(user: &User, token_type: TokenType) -> Result<String, Error> {
        let iat = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();

        let exp = match token_type {
            TokenType::Access => iat + *ACCESS_EXP,
            TokenType::Refresh => iat + *REFRESH_EXP,
        };

        let access_token_claims = Claims {
            sub: user.id.clone(),
            iss: String::from("warpy.tv"),
            iat,
            exp,
        };

        encode(
            &Header::default(),
            &access_token_claims,
            &EncodingKey::from_secret(&*SECRET.as_bytes()),
        )
    }
}
