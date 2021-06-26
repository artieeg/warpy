use crate::context::WarpyContext;
use crate::dao::*;
use actix_web::HttpRequest;
use actix_web::{web, HttpResponse};
use serde_json::json;

pub async fn route<U, R>(request: HttpRequest, data: web::Data<WarpyContext<U, R>>) -> HttpResponse
where
    U: UserDAOExt,
    R: RefreshTokenDAOExt,
{
    let user_id = request.headers().get("user-id").unwrap().to_str().unwrap();

    match data.user_dao.get(user_id).await {
        Some(user) => HttpResponse::Ok().json(json! ({
            "result": {
                "user": user
            }
        })),
        None => HttpResponse::NotFound().finish(),
    }
}
