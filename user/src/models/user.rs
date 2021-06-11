use errors;
use crate::payloads::user;
use nanoid::nanoid;
use serde::{Deserialize, Serialize};
use std::convert::TryFrom;

#[derive(Clone, Serialize, Deserialize, Debug)]
pub enum SignUpMethod {
    Google,
    Apple,
    Facebook,
    Dev,
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

impl User {
    pub fn apply_updates(&mut self, update: user::UpdateUser) {
        if let Some(username) = update.username {
            self.username = username;
        }

        if let Some(avatar) = update.avatar {
            self.avatar = avatar;
        }

        if let Some(last_name) = update.last_name {
            self.last_name = last_name;
        }

        if let Some(first_name) = update.first_name {
            self.first_name = first_name;
        }
    }
}

impl TryFrom<user::CreateDev> for User {
    type Error = errors::user::CreateUserError;

    fn try_from(payload: user::CreateDev) -> Result<Self, Self::Error> {
        let username = payload.username.clone();

        if username.len() < 3 {
            return Err(errors::user::InvalidUsername { username }.into());
        }

        Ok(User {
            id: nanoid!(),
            sign_up_method: SignUpMethod::Dev,
            email: payload.email.clone(),
            credential: "DEV_ACCOUNT".to_string(),
            first_name: payload.first_name.clone(),
            last_name: payload.last_name.clone(),
            username: payload.username.clone(),
            avatar: payload.avatar.clone(),
        })
    }
}
