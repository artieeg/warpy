use actix_web::web;

mod create;
mod delete;

use crate::dao::user::*;
use crate::dao::refresh_token::*;

pub fn config(cfg: &mut web::ServiceConfig)  {
    cfg.route("/user", web::post().to(create::create::<UserDAO, RefreshTokenDAO>)).service(delete::delete);
}
