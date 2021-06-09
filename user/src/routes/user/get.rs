use crate::context::WarpyContext;
use crate::dao::*;
use actix_web::{web, HttpResponse};
use std::sync::Mutex;

pub async fn get<U, R>(
    path: web::Path<String>,
    data: web::Data<Mutex<WarpyContext<U, R>>>,
) -> HttpResponse
where
    U: UserDAOExt,
    R: RefreshTokenDAOExt,
{
    let id = path.0;

    HttpResponse::NotImplemented().finish()
}
