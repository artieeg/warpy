mod context;
mod dao;
mod database;
mod models;
mod payloads;
mod routes;
mod amqp_client;

use actix_web::{web, App, HttpServer};
use context::WarpyContext;
use database::Database;
use futures::join;
use std::sync::Mutex;

use crate::amqp_client::AMQPClient;

#[cfg(test)]
mod fixtures;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();

    let (stream_dao, hub_dao) = Database::connect().await;
    let context = WarpyContext::create(stream_dao, hub_dao);
    let data = web::Data::new(Mutex::new(context));

    let mut amqp_client = AMQPClient::new();
    amqp_client.connect().await;

    let mut amqp_client_1 = amqp_client.clone();
    let user1 = amqp_client_1.request_user("KDidxOR3i3nq2YJEAXxqy".to_string());

    user1.await;
    //join!(user1, user2);

    let port = std::env::var("PORT").unwrap();
    println!("Running streams service on port {}", port);

    HttpServer::new(move || {
        App::new()
            .app_data(data.clone())
            .configure(routes::feed::config)
            .configure(routes::streams::config)
            .configure(routes::hubs::config)
    })
    .bind(format!("0.0.0.0:{}", port))?
    .run()
    .await
}
