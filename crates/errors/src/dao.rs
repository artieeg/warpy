use actix_web::HttpResponse;
use serde_json::json;

#[derive(Debug)]
pub enum DAOError {
    Insert,
    Delete,
    AlreadyExists(&'static str),
    Update,
    NotFound,
}

impl Into<HttpResponse> for DAOError {
    fn into(self) -> HttpResponse {
        match self {
            DAOError::Insert => HttpResponse::InternalServerError().json(json!({
                "error": {
                    "message": "Failed to save the record"
                }
            })),
            DAOError::Delete => HttpResponse::InternalServerError().json(json!({
                "error": {
                    "message": "Failed to delete the record"
                }
            })),
            DAOError::NotFound => HttpResponse::NotFound().json(json!({
                "error": {
                    "message": "Not found"
                }
            })),
            DAOError::AlreadyExists(field) => HttpResponse::BadRequest().json(json!({
                "error": {
                    "reason": field,
                    "message": format!("Value for {} is invalid", field)
                }
            })),
            DAOError::Update => HttpResponse::InternalServerError().json(json!({
                "error": {
                    "message": "Failed to update, try again later"
                }
            }))
        }
    }
}
