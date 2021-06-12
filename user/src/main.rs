mod context;
mod dao;
mod database;
mod errors;
mod models;
mod payloads;
mod routes;

#[cfg(test)]
mod fixtures;

use context::WarpyContext;
use database::Database;

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
            .configure(routes::user::config)
            .configure(routes::token_refresh::config)
    })
    .bind(format!("0.0.0.0:{}", port))?
    .run()
    .await
}
