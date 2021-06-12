use crate::context::WarpyContext;
use crate::dao::*;
use actix_web::{web, HttpResponse};
use std::sync::Mutex;

pub async fn route<S, H>(data: web::Data<Mutex<WarpyContext<S, H>>>) -> HttpResponse
where
    S: StreamDAOExt,
    H: HubDAOExt,
{
    HttpResponse::NotImplemented().finish()
}
