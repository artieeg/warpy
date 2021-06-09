use actix_web::web;

mod create;
mod delete;
mod get;
mod update;

use crate::dao::refresh_token::*;
use crate::dao::user::*;
use crate::middlewares::Auth;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.route(
        "/user",
        web::post().to(create::create::<UserDAO, RefreshTokenDAO>),
    )
    .service(
        web::resource("/user/{user_id}")
            .wrap(Auth)
            .route(web::delete().to(delete::delete::<UserDAO, RefreshTokenDAO>)),
    )
    .service(
        web::resource("/user/{user_id}").route(web::get().to(get::get::<UserDAO, RefreshTokenDAO>)),
    )
    .service(
        web::resource("/user")
            .wrap(Auth)
            .route(web::get().to(get::get::<UserDAO, RefreshTokenDAO>)),
    );
}
