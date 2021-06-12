use crate::context::WarpyContext;
use crate::dao::*;
use crate::payloads::CreateStreamPayload;
use actix_web::{web, HttpRequest, HttpResponse};
use std::sync::Mutex;

pub async fn route<S, H>(
    req: HttpRequest,
    payload: web::Json<CreateStreamPayload>,
    data: web::Data<Mutex<WarpyContext<S, H>>>,
) -> HttpResponse
where
    S: StreamDAOExt,
    H: HubDAOExt,
{
    HttpResponse::NotImplemented().finish()
}

#[cfg(test)]
mod tests {
    use super::*;
    use actix_rt;

    #[actix_rt::test]
    async fn create_stream_test() {
        unimplemented!();
    }

    #[actix_rt::test]
    async fn already_streaming_test() {
        unimplemented!();
    }

    #[actix_rt::test]
    async fn invalid_hub_test() {
        unimplemented!();
    }
}
