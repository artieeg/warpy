use crate::context::WarpyContext;
use crate::dao::*;
use actix_web::HttpRequest;
use actix_web::{web, HttpResponse};

pub async fn route<F>(
    path: HttpRequest,
    data: web::Data<WarpyContext<F>>,
) -> HttpResponse
where
    F: FeedDAOExt,
{
    HttpResponse::NotImplemented().finish()
}
