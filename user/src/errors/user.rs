use actix_web::{http::StatusCode, HttpResponse};
use serde_json::json;
use std::fmt;

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

pub struct UserAlreadyExistsError {
    pub same_username: bool,
    pub same_email: bool,
}

impl fmt::Display for UserAlreadyExistsError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "User already exists")
    }
}

impl Into<HttpResponse> for UserAlreadyExistsError {
    fn into(self) -> HttpResponse {
        HttpResponse::build(StatusCode::CONFLICT).json(json!({
            "error": {
                "duplicate_username": self.same_username,
                "duplicate_email": self.same_email,
                "message": "User already exists"
            }
        }))
    }
}
