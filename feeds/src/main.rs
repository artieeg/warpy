use actix_web::{web, App, HttpServer};

mod amqp_client;
mod context;
mod dao;
mod models;
mod routes;

use context::WarpyContext;
use dao::FeedDAO;
use lapin::{Connection, ConnectionProperties};

use crate::amqp_client::{AMQPClient, AMQPClientExt};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let uri = std::env::var("AMQP_URI").unwrap();
    let connection = Connection::connect(&uri, ConnectionProperties::default())
        .await
        .expect("Connecting to AMQP service");

    let mut amqp_client = AMQPClient::new();
    amqp_client.connect(&connection).await;

    let feed_dao = FeedDAO::new();

    let context = WarpyContext::create(feed_dao, amqp_client.clone());
    let data = web::Data::new(context);

    let port = std::env::var("PORT").unwrap();

    let server = HttpServer::new(move || {
        App::new()
            .app_data(data.clone())
            .configure(routes::feed::config)
    })
    .bind(format!("0.0.0.0:{}", port))?;

    actix_web::rt::spawn(async move {
        amqp_client.clone().on_new_stream().await;
    });

    println!("Started feeds service on {}", port);

    server.run().await
}
