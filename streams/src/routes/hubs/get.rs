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
    let hubs = data.hub_dao.get_all().await;

    HttpResponse::Ok().json(json!({
        "hubs": hubs
    }))
}
