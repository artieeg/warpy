mod context;
mod dao;
mod database;
mod models;
mod payloads;
mod routes;
use actix_web::{web, App, HttpServer};
use context::WarpyContext;
use database::Database;
use std::sync::Mutex;

#[cfg(test)]
mod fixtures;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let (stream_dao, hub_dao) = Database::connect().await;
    let context = WarpyContext::create(stream_dao, hub_dao);
    let data = web::Data::new(Mutex::new(context));

    let port = std::env::var("PORT").unwrap();
    println!("Running streams service on port {}", port);

    HttpServer::new(move || {
        App::new()
            .app_data(data.clone())
            .configure(routes::streams::config)
            .configure(routes::hubs::config)
            .configure(routes::feed::config)
    })
    .bind(format!("0.0.0.0:{}", port))?
    .run()
    .await
}
