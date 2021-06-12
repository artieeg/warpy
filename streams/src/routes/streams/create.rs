use crate::context::WarpyContext;
use crate::dao::*;
use actix_web::{web, HttpRequest, HttpResponse};

pub async fn route<S>() -> HttpResponse
where
    S: StreamDAOExt,
{
    HttpResponse::NotImplemented().finish()
}
