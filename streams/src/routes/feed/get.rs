use crate::context::WarpyContext;
use crate::dao::*;
use actix_web::{web, HttpResponse};
use std::sync::Mutex;
use serde_json::json;

pub async fn route<S, H>(data: web::Data<Mutex<WarpyContext<S, H>>>) -> HttpResponse
where
    S: StreamDAOExt,
    H: HubDAOExt,
{
    let data = data.lock().unwrap();
    let streams = data.stream_dao.dev_get_feed().await;

    HttpResponse::Ok().json(json!({
        "streams": streams
    }))
}
