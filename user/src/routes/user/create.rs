use crate::payloads::user;
use crate::{models::User, Context};
use actix_web::{web, HttpResponse};
use std::convert::TryFrom;
use serde_json::json;
use std::sync::Mutex;

pub async fn create(
    payload: web::Json<user::CreateWithPassword>,
    data: web::Data<Mutex<Context>>,
) -> HttpResponse {
    let user = match User::try_from(payload) {
        Ok(user) => user,
        Err(e) => return e.into()
    };

    match data.lock().unwrap().user_dao.add_user(user).await {
        Ok(id) => HttpResponse::Ok().json(json! ({
            "user_id": id
        })),
        Err(e) => e.into()
    }
}
