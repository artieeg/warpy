use jsonwebtoken::{decode, encode, errors::Error, DecodingKey, EncodingKey, Header, Validation};
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use actix_web::HttpResponse;
use std::env::var;
use std::time::{SystemTime, UNIX_EPOCH};

lazy_static! {
    static ref SECRET: String = var("JWT_SECRET").unwrap();
    static ref ACCESS_EXP: u64 = var("JWT_ACCESS_EXP_SECONDS").unwrap().parse().unwrap();
    static ref REFRESH_EXP: u64 = var("JWT_REFRESH_EXP_SECONDS").unwrap().parse().unwrap();
}

#[derive(Debug)]
pub struct JWTError {
    inner: Error
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
    pub fn from_string(claims_string: &str) -> Result<Claims, JWTError> {
        let mut v = Validation::default();

        v.validate_exp = false;

        let result = decode::<Claims>(
            &claims_string,
            &DecodingKey::from_secret(&*SECRET.as_bytes()),
            &v,
        );

        match result {
            Ok(data) => Ok(data.claims),
            Err(e) => Err(e.into()),
        }
    }

    pub fn new(id: String, token_type: TokenType) -> Result<String, JWTError> {
        let iat = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();

        let exp = match token_type {
            TokenType::Access => iat + *ACCESS_EXP,
            TokenType::Refresh => iat + *REFRESH_EXP,
        };

        let access_token_claims = Claims {
            sub: id,
            iss: String::from("warpy.tv"),
            iat,
            exp,
        };

        let encoded = encode(
            &Header::default(),
            &access_token_claims,
            &EncodingKey::from_secret(&*SECRET.as_bytes()),
        );

        match encoded {
            Ok(encoded) => Ok(encoded),
            Err(e) => Err(e.into())
        }
    }
}

impl Into<JWTError> for Error {
    fn into(self) -> JWTError {
        JWTError {inner: self}        
    }
}

impl Into<HttpResponse> for JWTError {
    fn into(self) -> HttpResponse {
        HttpResponse::Forbidden().finish()        
    }
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
