use std::fmt;
use actix_web::HttpResponse;
use serde_json::json;
pub struct DAOInsertError;

impl fmt::Display for DAOInsertError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "DB write failure")
    }
}

impl Into<HttpResponse> for DAOInsertError {
    fn into(self) -> HttpResponse {
        HttpResponse::InternalServerError().json(json!({
            "error": {
                "message": "Failed to save user"
            }
        }))
    }
}
