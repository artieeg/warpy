use crate::context::WarpyContext;
use crate::dao::*;
use claims::*;
use crate::payloads::refresh_token::TokenRefreshPayload;
use actix_web::{web, HttpResponse};
use serde_json::json;
use std::sync::Mutex;

async fn route<U, R>(
    payload: web::Json<TokenRefreshPayload>,
    data: web::Data<Mutex<WarpyContext<U, R>>>,
) -> HttpResponse
where
    U: UserDAOExt,
    R: RefreshTokenDAOExt,
{
    let token = payload.token.as_str();

    let claims = match Claims::from_string(token) {
        Ok(claims) => claims,
        Err(e) => return e.into(),
    };

    let data = data.lock().unwrap();

    //If token does not exist in DB
    if data.refresh_token_dao.get(token).await.is_none() {
        return HttpResponse::Forbidden().finish();
    }

    match Claims::new(claims.sub, TokenType::Access) {
        Ok(access_token) => {
            HttpResponse::Ok().json(json!({
                "access": access_token
            }))
        },
        Err(e) => e.into()
    }
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.route(
        "/token/refresh",
        web::post().to(route::<UserDAO, RefreshTokenDAO>),
    );
}
