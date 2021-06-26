use crate::context::WarpyContext;
use crate::dao::*;
use crate::payloads::DeleteStreamPayload;
use actix_web::{web, HttpRequest, HttpResponse};
use std::sync::Mutex;

pub async fn route<S, H>(
    req: HttpRequest,
    payload: web::Json<DeleteStreamPayload>,
    data: web::Data<Mutex<WarpyContext<S, H>>>,
) -> HttpResponse
where
    S: StreamDAOExt,
    H: HubDAOExt,
{
    let id = payload.id.clone();

    let data = data.lock().unwrap();
    match data.stream_dao.delete(id.as_str()).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(e) => {
            log::error!("{:#?}", e);
            e.into()
        }
    }
}
