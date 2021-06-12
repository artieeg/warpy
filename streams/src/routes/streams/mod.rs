use actix_web::web;
use crate::dao::*;

mod create;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.route(
        "/stream",
        web::post().to(create::route::<StreamDAO>),
    );
}
