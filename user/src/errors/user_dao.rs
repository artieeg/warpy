use std::fmt;
use actix_web::HttpResponse;
use serde_json::json;
pub struct AddUserError;

impl fmt::Display for AddUserError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Failed to save a user to the DB")
    }
}

impl Into<HttpResponse> for AddUserError {
    fn into(self) -> HttpResponse {
        HttpResponse::InternalServerError().json(json!({
            "error": {
                "message": "Failed to save user"
            }
        }))
    }
}
