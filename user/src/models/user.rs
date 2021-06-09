use crate::errors;
use crate::payloads::user;
use bcrypt;
use nanoid::nanoid;
use serde::{Deserialize, Serialize};
use std::convert::TryFrom;

#[derive(Clone, Serialize, Deserialize, Debug)]
pub enum SignUpMethod {
    Google,
    Apple,
    Facebook,
    Password,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct User {
    pub id: String,
    pub first_name: String,
    pub last_name: String,
    pub username: String,
    pub avatar: String,
    pub sign_up_method: SignUpMethod,
    pub email: String,
    pub credential: String,
}

impl TryFrom<user::CreateWithPassword> for User {
    type Error = errors::user::CreateUserError;

    fn try_from(payload: user::CreateWithPassword) -> Result<Self, Self::Error> {
        let username = payload.username.clone();
        let password = payload.password.clone();

        if username.len() < 3 {
            return Err(errors::user::InvalidUsername { username }.into());
        }

        if password.len() < 5 {
            return Err(errors::user::InvalidPassword { password }.into());
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
