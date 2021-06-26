use crate::context::WarpyContext;
use crate::dao::*;
use crate::models::Stream;
use crate::payloads::CreateStreamPayload;
use actix_web::{web, HttpRequest, HttpResponse};
use std::sync::Mutex;
use serde_json::json;

pub async fn route<S, H>(
    req: HttpRequest,
    payload: web::Json<CreateStreamPayload>,
    data: web::Data<Mutex<WarpyContext<S, H>>>,
) -> HttpResponse
where
    S: StreamDAOExt,
    H: HubDAOExt,
{
    let user = req.headers().get("user-id").unwrap().to_str().unwrap();
    let data = data.lock().unwrap();

    /*
    //Check if hub id is valid
    let hub_id = payload.hub.as_str();
    if !data.hub_dao.exists(hub_id).await {
        return HttpResponse::BadRequest().finish();
    }
    */

    let already_streaming = data.stream_dao.is_user_live(user).await;
    if already_streaming {
        return HttpResponse::Conflict().finish();
    }

    let stream = Stream::from_payload(payload.into_inner(), user);
    match data.stream_dao.create(stream).await {
        Ok(id) => HttpResponse::Ok().json(json!({
            "stream_id": id
        })),
        Err(e) => e.into()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::dao::mocks::*;
    use crate::fixtures::*;
    use actix_rt;
    use actix_web::{http::StatusCode, test, HttpRequest};

    fn get_request() -> HttpRequest {
        test::TestRequest::post()
            .header("user-id", "test-user-id")
            .to_http_request()
    }

    #[actix_rt::test]
    async fn create_stream_test() {
        let mut stream_dao = MockStreamDAO::new();
        let mut hub_dao = MockHubDAO::new();

        hub_dao.expect_exists().returning(|_| true);
        stream_dao.expect_is_user_live().returning(|_| false);
        stream_dao.expect_create().returning(|_| Ok(()));

        let context = build_context(stream_dao, hub_dao);
        let req = get_request();
        let payload = create_stream_payload_fixture();

        let resp = route(req, web::Json(payload), context).await;

        assert_eq!(resp.status(), StatusCode::OK);
    }

    #[actix_rt::test]
    async fn already_streaming_test() {
        let mut stream_dao = MockStreamDAO::new();
        let mut hub_dao = MockHubDAO::new();

        hub_dao.expect_exists().returning(|_| true);
        stream_dao.expect_is_user_live().returning(|_| true);
        stream_dao.expect_create().returning(|_| Ok(()));

        let context = build_context(stream_dao, hub_dao);
        let req = get_request();
        let payload = create_stream_payload_fixture();

        let resp = route(req, web::Json(payload), context).await;

        assert_eq!(resp.status(), StatusCode::CONFLICT);
    }

    #[actix_rt::test]
    async fn invalid_hub_test() {
        let mut stream_dao = MockStreamDAO::new();
        let mut hub_dao = MockHubDAO::new();

        hub_dao.expect_exists().returning(|_| false);
        stream_dao.expect_is_user_live().returning(|_| true);
        stream_dao.expect_create().returning(|_| Ok(()));

        let context = build_context(stream_dao, hub_dao);
        let req = get_request();
        let payload = create_stream_payload_fixture();

        let resp = route(req, web::Json(payload), context).await;

        assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
    }
}
