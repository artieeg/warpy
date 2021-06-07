use crate::payloads::user;
use crate::{models::User, Context};
use actix_web::{web, HttpResponse};
use std::convert::TryFrom;
use std::sync::Mutex;

pub async fn create(
    payload: web::Json<user::CreateWithPassword>,
    _data: web::Data<Mutex<Context>>,
) -> HttpResponse {
    let user = match User::try_from(payload) {
        Ok(user) => user,
        Err(e) => return e.into()
    };

    HttpResponse::Ok().body(format!("ok, hi {:#?}", user))
}
