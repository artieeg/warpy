use actix_web::web;

use crate::{amqp_client::AMQPClient, dao::FeedDAO};

mod get;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/feed")
            .route(web::get().to(get::route::<FeedDAO, AMQPClient>))
    );
}
