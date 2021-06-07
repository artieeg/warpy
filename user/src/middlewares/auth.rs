use actix_service::{Service, Transform};
use actix_web::{
    dev::ServiceRequest,
    dev::ServiceResponse,
    http::{HeaderName, HeaderValue},
    Error, HttpResponse,
};
use futures::future::{ok, Either, Ready};
use std::task::{Context, Poll};

use crate::jwt::Claims;

pub struct Auth;

impl<S, B> Transform<S> for Auth
where
    S: Service<Request = ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Request = ServiceRequest;
    type Response = ServiceResponse<B>;
    type Error = Error;
    type InitError = ();
    type Transform = AuthMiddleware<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ok(AuthMiddleware { service })
    }
}

pub struct AuthMiddleware<S> {
    service: S,
}

impl<S, B> Service for AuthMiddleware<S>
where
    S: Service<Request = ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Request = ServiceRequest;
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = Either<S::Future, Ready<Result<Self::Response, Self::Error>>>;

    fn poll_ready(&mut self, cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        self.service.poll_ready(cx)
    }

    fn call(&mut self, req: ServiceRequest) -> Self::Future {
        let mut req = ServiceRequest::from(req);

        let authorization = req
            .headers()
            .get("authorization")
            .unwrap()
            .to_str()
            .unwrap();

        match Claims::from_string(authorization) {
            Ok(claims) => {
                req.headers_mut().insert(
                    HeaderName::from_static("user-id"),
                    HeaderValue::from_str(&claims.sub).unwrap(),
                );

                return Either::Left(self.service.call(req));
            }
            Err(_) => {
                return Either::Right(ok(
                    req.into_response(HttpResponse::Forbidden().finish().into_body())
                ));
            }
        };
    }
}
