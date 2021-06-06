mod models;
mod user_dao;

use models::User;
use user_dao::UserDAO;

use actix_web::{get, App, HttpServer, Responder};

#[get("/")]
async fn index() -> impl Responder {
    format!("monke")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let port = std::env::var("PORT").unwrap();

    println!("Running user service on port {}", port);

    HttpServer::new(|| App::new().service(index))
        .bind(format!("0.0.0.0:{}", port))?
        .run()
        .await
}
