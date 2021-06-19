use actix_web::web;

use crate::dao::FeedDAO;

mod get;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/feed")
            .route(web::get().to(get::route::<FeedDAO>))
    );
}
