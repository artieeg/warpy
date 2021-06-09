use crate::{
    context::WarpyContext,
    dao::mocks::*,
    models::{SignUpMethod, User},
    payloads::user::CreateWithPassword,
};
use actix_web::web;
use rstest::*;
use std::sync::Mutex;

#[fixture]
pub fn user_fixture() -> User {
    User {
        id: "V1StGXR8_Z5jdHi6B-myT".to_string(),
        first_name: "John".to_string(),
        last_name: "Dou".to_string(),
        username: "monke".to_string(),
        avatar: "avatar.com/avatar.gif".to_string(),
        sign_up_method: SignUpMethod::Password,
        email: "dou@monkecorp.com".to_string(),
        credential: "$2y$12$uFuMl2xK5YBuXHC9x08.SenwLmZo.HcrpvPv.cB2hGhW7aXWg4mtu".to_string(),
    }
}

#[fixture]
pub fn create_payload_fixture() -> CreateWithPassword {
    CreateWithPassword {
        first_name: "John".to_string(),
        last_name: "Dou".to_string(),
        username: "monke".to_string(),
        password: "test_password".to_string(),
        avatar: "avatar".to_string(),
        email: "jd@test.com".to_string(),
    }
}

pub fn build_context(
    user_dao: MockUserDAO,
    refresh_token_dao: MockRefreshTokenDAO,
) -> web::Data<Mutex<WarpyContext<MockUserDAO, MockRefreshTokenDAO>>> {
    web::Data::new(Mutex::new(WarpyContext::create(
        user_dao,
        refresh_token_dao,
    )))
}
