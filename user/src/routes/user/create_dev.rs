use crate::context::WarpyContext;
use crate::dao::*;
use claims::{Claims, TokenType};
use crate::models::{RefreshToken, User};
use crate::payloads::user;
use actix_web::{web, HttpResponse};
use serde_json::json;
use std::convert::TryFrom;

fn get_tokens(user: &User) -> (String, String) {
    let refresh = Claims::new(user.id.clone(), TokenType::Refresh).unwrap();
    let access = Claims::new(user.id.clone(), TokenType::Access).unwrap();

    (access, refresh)
}

pub async fn route<U, R>(
    payload: web::Json<user::CreateDev>,
    data: web::Data<WarpyContext<U, R>>,
) -> HttpResponse
where
    U: UserDAOExt,
    R: RefreshTokenDAOExt,
{
    let user = match User::try_from(payload.into_inner()) {
        Ok(user) => user,
        Err(e) => return e.into(),
    };

    let id = user.id.clone();
    let username = user.username.clone();

    let (access, refresh) = get_tokens(&user);


    //Check if user already exists
    if let Err(e) = data.user_dao.check_username(username.as_str()).await {
        return e.into();
    }

    //Save refresh token to the DB
    if let Err(e) = data
        .refresh_token_dao
        .create(RefreshToken::new(&id, &refresh))
        .await
    {
        //Return an error if any
        return e.into();
    }

    match data.user_dao.create(user).await {
        Ok(_) => HttpResponse::Ok().json(json! ({
            "user_id": id,
            "access": access,
            "refresh": refresh
        })),
        Err(e) => e.into(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    use crate::dao::mocks::*;
    use crate::fixtures::*;
    use actix_web::{http::StatusCode, web};

    #[actix_rt::test]
    async fn create_user_test() {
        let mut user_dao = MockUserDAO::new();
        let mut refresh_token_dao = MockRefreshTokenDAO::new();

        user_dao.expect_find().returning(|_, _| None);
        refresh_token_dao.expect_create().returning(|_| Ok(()));
        user_dao.expect_create().returning(|_| Ok(()));

        let context = build_context(user_dao, refresh_token_dao);
        let payload = create_payload_fixture();

        let resp = route(web::Json(payload), context).await;

        assert_eq!(resp.status(), StatusCode::OK);
    }

    #[actix_rt::test]
    async fn invalid_username_test() {
        let mut user_dao = MockUserDAO::new();
        let mut refresh_token_dao = MockRefreshTokenDAO::new();

        let mut payload = create_payload_fixture();
        payload.username = "k".to_string();

        user_dao.expect_find().returning(|_, _| Some(user_fixture()));
        refresh_token_dao.expect_create().returning(|_| Ok(()));
        user_dao.expect_create().returning(|_| Ok(()));

        let context = build_context(user_dao, refresh_token_dao);
        let resp = route(web::Json(payload), context).await;

        assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
    }

    #[actix_rt::test]
    async fn user_already_exists_test() {
        let payload = create_payload_fixture();

        let mut user_dao = MockUserDAO::new();
        let mut refresh_token_dao = MockRefreshTokenDAO::new();

        user_dao.expect_find().returning(|_, _| Some(user_fixture()));
        refresh_token_dao.expect_create().returning(|_| Ok(()));
        user_dao.expect_create().returning(|_| Ok(()));

        let context = build_context(user_dao, refresh_token_dao);
        let resp = route(web::Json(payload), context).await;

        assert_eq!(resp.status(), StatusCode::CONFLICT);
    }
}