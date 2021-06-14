use crate::context::WarpyContext;
use crate::dao::*;
use crate::payloads::user::UpdateUser;
use actix_web::HttpRequest;
use actix_web::{web, HttpResponse};
use std::sync::Mutex;

pub async fn route<U, R>(
    req: HttpRequest,
    update: web::Json<UpdateUser>,
    data: web::Data<WarpyContext<U, R>>,
) -> HttpResponse
where
    U: UserDAOExt,
    R: RefreshTokenDAOExt,
{
    let user_id = req.headers().get("user-id").unwrap().to_str().unwrap();

    if let Some(new_username) = &update.username {
        let username_check_result = data.user_dao.check_username(new_username.as_str()).await;

        if let Err(e) = username_check_result {
            return e.into();
        }
    }

    let user = data.user_dao.get(user_id).await;

    if user.is_none() {
        return HttpResponse::NotFound().finish();
    }

    let mut user = user.unwrap();
    user.apply_updates(update.into_inner());
    match data.user_dao.update(user).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(e) => e.into()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::dao::mocks::*;
    use errors::dao::*;
    use crate::fixtures::*;
    use actix_rt;
    use actix_web::{http::StatusCode, test};

    #[actix_rt::test]
    async fn username_not_available_test() {
        let mut user_dao = MockUserDAO::new();
        let refresh_token_dao = MockRefreshTokenDAO::new();

        //Simulate update error
        user_dao
            .expect_update()
            .returning(|_| Ok(()));

        user_dao
            .expect_get()
            .returning(|_| Some(user_fixture()));

        user_dao
            .expect_check_username()
            .returning(|_| Err(DAOError::AlreadyExists("username")));

        let context = build_context(user_dao, refresh_token_dao);

        let payload = UpdateUser {
            first_name: None,
            last_name: None,
            username: Some("new-test-username".to_string()),
            avatar: None,
        };

        let request = test::TestRequest::put()
            .header("user-id", "test-user-id")
            .to_http_request();

        let resp = route(request, web::Json(payload), context).await;

        assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
    }

    #[actix_rt::test]
    async fn update_user_test() {
        let mut user_dao = MockUserDAO::new();
        let refresh_token_dao = MockRefreshTokenDAO::new();

        user_dao.expect_update().returning(|_| Ok(()));

        user_dao
            .expect_check_username()
            .returning(|_| Ok(()));

        user_dao
            .expect_get()
            .returning(|_| Some(user_fixture()));

        let context = build_context(user_dao, refresh_token_dao);

        let payload = UpdateUser {
            first_name: None,
            last_name: None,
            username: Some("new-test-username".to_string()),
            avatar: None,
        };

        let request = test::TestRequest::put()
            .header("user-id", "test-user-id")
            .to_http_request();

        let resp = route(request, web::Json(payload), context).await;

        assert_eq!(resp.status(), StatusCode::OK);
    }
}
