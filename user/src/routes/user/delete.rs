use actix_web::{delete, web, HttpRequest, HttpResponse};

#[delete("/user/{id}")]
pub async fn delete(req: HttpRequest, path: web::Path<String>) -> HttpResponse {
    let id = path.0;

    HttpResponse::Ok().finish()
}
