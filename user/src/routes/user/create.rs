use crate::jwt::{Claims, TokenType};
use crate::payloads::user;
use crate::{
    models::{RefreshToken, User},
    Context,
};
use actix_web::{web, HttpResponse};
use serde_json::json;
use std::convert::TryFrom;
use std::sync::Mutex;

pub async fn create(
    payload: web::Json<user::CreateWithPassword>,
    data: web::Data<Mutex<Context>>,
) -> HttpResponse {
    let user = match User::try_from(payload) {
        Ok(user) => user,
        Err(e) => return e.into(),
    };

    let id = user.id.clone();
    let username = user.username.clone();
    let email = user.email.clone();

    let refresh = Claims::new(&user, TokenType::Refresh).unwrap();
    let access = Claims::new(&user, TokenType::Access).unwrap();

    let data = data.lock().unwrap();

    let user_already_exists = data
        .user_dao
        .find_user(username.as_str(), email.as_str())
        .await
        .is_some();

    if user_already_exists {
        unimplemented!();
    }

    //Save refresh token to the DB
    if let Err(e) = data
        .refresh_token_dao
        .add_token(RefreshToken::new(&id, &refresh))
        .await
    {
        //Return an error if any
        return e.into();
    }

    match data.user_dao.add_user(user).await {
        Ok(_) => HttpResponse::Ok().json(json! ({
            "user_id": id,
            "access": access,
            "refresh": refresh
        })),
        Err(e) => e.into(),
    }
}
