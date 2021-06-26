use actix_web::web;

mod create_dev;
mod delete;
mod get;
mod update;
mod whoami;

use crate::dao::refresh_token::*;
use crate::dao::user::*;
use auth_middleware::Auth;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.route(
        "/user/dev",
        web::post().to(create_dev::route::<UserDAO, RefreshTokenDAO>),
    )
    .service(
        web::resource("/user/{user_id}")
            .wrap(Auth)
            .route(web::delete().to(delete::route::<UserDAO, RefreshTokenDAO>)),
    )
    .service(
        web::resource("/whoami")
            .wrap(Auth)
            .route(web::get().to(whoami::route::<UserDAO, RefreshTokenDAO>)),
    )
    .service(
        web::resource("/user/{user_id}")
            .route(web::get().to(get::route::<UserDAO, RefreshTokenDAO>)),
    )
    .service(
        web::resource("/user")
            .wrap(Auth)
            .route(web::put().to(update::route::<UserDAO, RefreshTokenDAO>)),
    );
}
