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

    let user_id = user.id.clone();
    let refresh = Claims::new(&user, TokenType::Refresh).unwrap();
    let access = Claims::new(&user, TokenType::Access).unwrap();

    let data = data.lock().unwrap();

    //Save refresh token to the DB
    if let Err(e) = data
        .refresh_token_dao
        .add_token(RefreshToken::new(&user_id, &refresh))
        .await
    {
        //Return an error if any
        return e.into();
    }

    match data.user_dao.add_user(user).await {
        Ok(_) => HttpResponse::Ok().json(json! ({
            "user_id": user_id,
            "access": access,
            "refresh": refresh
        })),
        Err(e) => e.into(),
    }
}
