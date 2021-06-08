mod context;
mod errors;
mod jwt;
mod middlewares;
mod models;
mod payloads;
mod routes;
mod dao;
mod database;

use database::Database;
use context::WarpyContext;

use actix_web::{web, App, HttpServer};
use std::sync::Mutex;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let (user_dao, refresh_token_dao) = Database::connect().await;

    let context = WarpyContext::create(user_dao, refresh_token_dao);
    let data = web::Data::new(Mutex::new(context));

    let port = std::env::var("PORT").unwrap();
    println!("Running user service on port {}", port);

    HttpServer::new(move || {
        App::new()
            .app_data(data.clone())
            .data(data.clone())
            .configure(routes::user::config)
    })
    .bind(format!("0.0.0.0:{}", port))?
    .run()
    .await
}

