mod context;
mod models;
mod user_dao;
mod routes;
mod errors;
mod payloads;

use context::Context;
use models::User;
use user_dao::UserDAO;

use actix_web::{get, web, App, HttpServer, Responder};
use std::sync::{Mutex, Arc};

#[get("/")]
async fn index() -> impl Responder {
    format!("monke")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let user_dao = UserDAO::new().await.unwrap();

    let context = Context::create(user_dao);
    let data = web::Data::new(Mutex::new(context));

    let port = std::env::var("PORT").unwrap();
    println!("Running user service on port {}", port);

    HttpServer::new(move || App::new()
        .app_data(data.clone())
        .data(data.clone())
        .configure(routes::user::config)
        .service(index))
        .bind(format!("0.0.0.0:{}", port))?
        .run()
        .await
}
