use actix_web::{App, HttpServer, web};

mod dao;
mod models;
mod context;
mod routes;
mod amqp_client;

use dao::FeedDAO;
use context::WarpyContext;

use crate::amqp_client::{AMQPClient, AMQPClientExt};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let mut amqp_client = AMQPClient::new();
    amqp_client.connect().await;

    let feed_dao = FeedDAO::new();

    let context = WarpyContext::create(feed_dao);
    let data = web::Data::new(context);

    let port = std::env::var("PORT").unwrap();

    HttpServer::new(move || {
        App::new()
            .app_data(data.clone())
            .configure(routes::feed::config)
    })
    .bind(format!("0.0.0.0:{}", port))?
    .run()
    .await
}
