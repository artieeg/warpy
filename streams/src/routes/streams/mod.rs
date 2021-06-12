use crate::dao::*;
use actix_web::web;
use auth_middleware::Auth;

mod create;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/streams")
            .wrap(Auth)
            .route(web::post().to(create::route::<StreamDAO>)),
    );
}
