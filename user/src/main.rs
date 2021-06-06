mod context;
mod models;
mod user_dao;

use context::Context;
use models::User;
use user_dao::UserDAO;

use actix_web::{get, App, HttpServer, Responder};

#[get("/")]
async fn index() -> impl Responder {
    format!("monke")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let user_dao = UserDAO::new().await.unwrap();

    let context = Context::create(user_dao);

    let port = std::env::var("PORT").unwrap();
    println!("Running user service on port {}", port);

    HttpServer::new(move || App::new()
        .data(context.clone())
        .service(index))
        .bind(format!("0.0.0.0:{}", port))?
        .run()
        .await
}
