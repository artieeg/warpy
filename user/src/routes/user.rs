use actix_web::web;

mod create;
use create::create;

pub fn config(cfg: &mut web::ServiceConfig) {
  cfg.route("/user", web::post().to(create));
}
