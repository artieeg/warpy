use crate::{context::WarpyContext, dao::mocks::*, models::Stream, payloads::CreateStreamPayload};
use actix_web::web;
use rstest::*;
use std::sync::Mutex;

#[fixture]
pub fn stream_fixture() -> Stream {
    Stream {
        id: "V1StGXR8_Z5jdHi6B-myT".to_string(),
        owner: "V1StGXR8_Z5jdHi6B-myT".to_string(),
        hub: "V1StGXR8_Z5jdHi6B-myT".to_string(),
        live: true,
        title: "Test stream".to_string(),
    }
}

pub fn create_stream_payload_fixture() -> CreateStreamPayload {
    CreateStreamPayload {
        title: "Test stream".to_string(),
        hub: "test-hub-id".to_string(),
    }
}

pub fn build_context(
    stream_dao: MockStreamDAO,
    hubs_dao: MockHubDAO,
) -> web::Data<Mutex<WarpyContext<MockStreamDAO, MockHubDAO>>> {
    web::Data::new(Mutex::new(WarpyContext::create(stream_dao, hubs_dao)))
}
