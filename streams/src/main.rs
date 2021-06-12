mod models;
mod dao;
mod database;
mod context;
use actix_web;
use database::Database;
use context::WarpyContext;

#[actix_web::main]
async fn main() {
    let stream_dao = Database::connect().await;
    let context = WarpyContext::create(stream_dao);
}
