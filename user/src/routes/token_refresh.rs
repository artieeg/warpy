use crate::context::WarpyContext;
use crate::dao::*;
use crate::payloads::refresh_token::TokenRefreshPayload;
use actix_web::{web, HttpResponse};
use serde_json::json;
use std::sync::Mutex;

pub async fn route<U, R>(
    payload: web::Json<TokenRefreshPayload>,
    data: web::Data<Mutex<WarpyContext<U, R>>>,
) -> HttpResponse
where
    U: UserDAOExt,
    R: RefreshTokenDAOExt,
{
    let token = payload.token.as_str();

    HttpResponse::NotImplemented().finish()
}
