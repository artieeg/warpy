use actix_web::{http::StatusCode, HttpResponse};
use serde_json::json;

#[derive(Debug, Clone)]
pub struct InvalidEmail {
    pub email: String
}

impl From<InvalidEmail> for CreateUserError {
    fn from(e: InvalidEmail) -> Self {
        CreateUserError {
            status: StatusCode::BAD_REQUEST,
            message: format!("Email {} cannot be used", e.email),
        }
    }
}

#[derive(Debug, Clone)]
pub struct InvalidUsername {
    pub username: String,
}

impl From<InvalidUsername> for CreateUserError {
    fn from(e: InvalidUsername) -> Self {
        CreateUserError {
            status: StatusCode::BAD_REQUEST,
            message: format!("Username {} cannot be used", e.username),
        }
    }
}

#[derive(Debug, Clone)]
pub struct CreateUserError {
    status: StatusCode,
    message: String,
}

impl Into<HttpResponse> for CreateUserError {
    fn into(self) -> HttpResponse {
        HttpResponse::build(self.status).json(json!({
            "error": {
                "message": self.message.as_str()
            }
        }))
    }
}
