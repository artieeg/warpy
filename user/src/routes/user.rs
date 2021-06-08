use actix_web::web;

mod create;
mod delete;

use crate::dao::refresh_token::*;
use crate::dao::user::*;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.route(
        "/user",
        web::post().to(create::create::<UserDAO, RefreshTokenDAO>),
    )
    .service(delete::delete);
}
