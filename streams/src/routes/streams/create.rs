use crate::context::WarpyContext;
use crate::dao::*;
use actix_web::{web, HttpRequest, HttpResponse};
use std::sync::Mutex;
use crate::payloads::CreateStreamPayload;

pub async fn route<S>(
    req: HttpRequest,
    payload: web::Json<CreateStreamPayload>,
    data: web::Data<Mutex<WarpyContext<S>>>,
) -> HttpResponse
where
    S: StreamDAOExt,
{
    HttpResponse::NotImplemented().finish()
}
