mod models;
mod dao;
use actix_web;
use dao::*;

#[actix_web::main]
async fn main() {
    println!("Hello, world!");
}
