use bcrypt;
use std::fmt;
use actix_web::{HttpResponse, http::StatusCode};
use serde_json::json;

#[derive(Debug, Clone)]
pub struct CreateUserError {
    status: StatusCode,
    message: String
}

#[derive(Debug, Clone)]
pub struct InvalidUsername {
    pub username: String,
}

impl fmt::Display for CreateUserError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Failed to convert user from payload")
    }
}

impl From<InvalidUsername> for CreateUserError {
    fn from(e: InvalidUsername) -> Self {
        CreateUserError {
            status: StatusCode::BAD_REQUEST,
            message: format!("Username {} cannot be used", e.username)
        }
    }
}

impl From<bcrypt::BcryptError> for CreateUserError {
    fn from(_: bcrypt::BcryptError) -> Self {
        CreateUserError {
            status: StatusCode::INTERNAL_SERVER_ERROR,
            message: String::from("Password Encryption Error")
        }
    }
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
