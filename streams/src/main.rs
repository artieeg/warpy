mod context;
mod dao;
mod database;
mod models;
mod routes;
use actix_web::{App, HttpServer, web};
use context::WarpyContext;
use database::Database;
use std::sync::Mutex;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let stream_dao = Database::connect().await;
    let context = WarpyContext::create(stream_dao);
    let data = web::Data::new(Mutex::new(context));

    let port = std::env::var("PORT").unwrap();
    println!("Running streams service on port {}", port);

    HttpServer::new(move || {
        App::new()
            .data(data.clone())
            .configure(routes::streams::config)
    })
    .bind(format!("0.0.0.0:{}", port))?
    .run()
    .await
}
