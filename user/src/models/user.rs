use crate::errors;
use crate::payloads::user;
use actix_web::web;
use bcrypt;
use serde::{Deserialize, Serialize};
use std::convert::TryFrom;
use nanoid::nanoid;

#[derive(Clone, Serialize, Deserialize, Debug)]
enum SignUpMethod {
    Google,
    Apple,
    Facebook,
    Password
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct User {
    id: String,
    first_name: String,
    last_name: String,
    username: String,
    avatar: String,
    sign_up_method: SignUpMethod, 
    email: String,
    credential: String,
}

impl TryFrom<web::Json<user::CreateWithPassword>> for User {
    type Error = errors::user::CreateUserError;

    fn try_from(payload: web::Json<user::CreateWithPassword>) -> Result<Self, Self::Error> {
        let username = payload.username.clone();

        if username.len() < 3 {
            return Err(errors::user::InvalidUsername { username }.into());
        }

        let hashed_password = bcrypt::hash(payload.password.clone(), bcrypt::DEFAULT_COST)?;

        Ok(User {
            id: nanoid!(),
            sign_up_method: SignUpMethod::Password,
            email: payload.email.clone(),
            credential: hashed_password,
            first_name: payload.first_name.clone(),
            last_name: payload.last_name.clone(),
            username: payload.username.clone(),
            avatar: payload.avatar.clone(),
        })
    }
}
