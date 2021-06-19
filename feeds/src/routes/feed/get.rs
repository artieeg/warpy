use crate::amqp_client::AMQPClientExt;
use crate::context::WarpyContext;
use crate::dao::*;
use actix_web::HttpRequest;
use actix_web::{web, HttpResponse};

pub async fn route<F, A>(
    path: HttpRequest,
    data: web::Data<WarpyContext<F, A>>,
) -> HttpResponse
where
    F: FeedDAOExt,
    A: AMQPClientExt,
{
    HttpResponse::NotImplemented().finish()
}
