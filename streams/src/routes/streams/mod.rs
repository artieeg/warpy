use crate::dao::*;
use actix_web::web;
use auth_middleware::Auth;

mod create;
mod delete;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/streams")
            .wrap(Auth)
            .route(web::post().to(create::route::<StreamDAO, HubDAO>))
            .route(web::delete().to(delete::route::<StreamDAO, HubDAO>)),
    );
}
