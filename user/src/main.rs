mod context;
mod dao;
mod database;
mod models;
mod payloads;
mod routes;
mod amqp_client;
mod amqp_handlers;

#[cfg(test)]
mod fixtures;

use std::sync::Mutex;

use context::WarpyContext;
use database::Database;
use amqp_handlers::*;

use actix_web::{web, App, HttpServer};
use futures::join;

use crate::amqp_client::*;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let (user_dao, refresh_token_dao) = Database::connect().await;

    let context = WarpyContext::create(user_dao.clone(), refresh_token_dao);
    let data = web::Data::new(context);

    let port = std::env::var("PORT").unwrap();
    println!("Running user service on port {}", port);

    let mut amqp_client = AMQPClient::new();
    amqp_client.connect().await;

    let request_user_handler = RequestUserAMQPHandler::new(user_dao.clone());
    actix_web::rt::spawn(async move {

        let mut amqp_client = amqp_client.clone();
        amqp_client.handle_user_request(request_user_handler).await;
    });

    HttpServer::new(move || {
        App::new()
            .app_data(data.clone())
            .configure(routes::user::config)
            .configure(routes::token_refresh::config)
    })
    .bind(format!("0.0.0.0:{}", port))?
    .run()
    .await
}
