mod models;
mod dao;
mod database;
use actix_web;
use database::Database;

#[actix_web::main]
async fn main() {
    let stream_dao = Database::connect().await;
}
