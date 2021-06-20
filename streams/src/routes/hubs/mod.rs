use crate::dao::*;
use actix_web::web;
mod get;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/hubs").route(web::get().to(get::route::<StreamDAO, HubDAO>)));
}