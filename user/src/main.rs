mod context;
mod errors;
mod jwt;
mod middlewares;
mod models;
mod payloads;
mod routes;
mod dao;

use context::WarpyContext;
use dao::{user::*, refresh_token::*};

use actix_web::{web, App, HttpServer};
use mongodb::{options::ClientOptions, Client};
use std::sync::Mutex;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let mongo_conn = std::env::var("MONGODB_CONN").unwrap();
    let options = ClientOptions::parse(mongo_conn.as_str()).await.unwrap();
    let client = Client::with_options(options).unwrap();

    let db = client.database("warpy");

    let mut user_dao = UserDAO::new();
    user_dao.connect(&db).await;

    let mut refresh_token_dao = RefreshTokenDAO::new();
    refresh_token_dao.connect(&db).await;

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
