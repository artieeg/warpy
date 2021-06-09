use crate::context::WarpyContext;
use crate::dao::*;
use actix_web::HttpRequest;
use actix_web::{web, HttpResponse};
use std::sync::Mutex;

pub async fn route<U, R>(
    req: HttpRequest,
    data: web::Data<Mutex<WarpyContext<U, R>>>,
) -> HttpResponse
where
    U: UserDAOExt,
    R: RefreshTokenDAOExt,
{
    HttpResponse::NotImplemented().finish()
}
