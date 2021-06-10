use crate::context::WarpyContext;
use crate::dao::*;
use crate::payloads::user::UpdateUser;
use actix_web::HttpRequest;
use actix_web::{web, HttpResponse};
use std::sync::Mutex;

pub async fn route<U, R>(
    req: HttpRequest,
    update: web::Json<UpdateUser>,
    data: web::Data<Mutex<WarpyContext<U, R>>>,
) -> HttpResponse
where
    U: UserDAOExt,
    R: RefreshTokenDAOExt,
{
    println!("{:#?}", update);

    HttpResponse::NotImplemented().finish()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::dao::mocks::*;
    use crate::fixtures::*;
    use crate::errors::dao::*;
    use actix_rt;
    use actix_web::{test, http::StatusCode};

    #[actix_rt::test]
    async fn username_not_available_test() {
        let mut user_dao = MockUserDAO::new();
        let refresh_token_dao = MockRefreshTokenDAO::new();

        //Simulate update error
        user_dao.expect_update().returning(|_, _| Err(DAOError::Update("username")));

        let context = build_context(user_dao, refresh_token_dao);

        let payload = UpdateUser {
            first_name: None,
            last_name: None,
            username: Some("new-test-username".to_string()),
            avatar: None,
        };

        let request = test::TestRequest::put()
            .header("authorization", "test-token")
            .to_http_request();

        let resp = route(request, web::Json(payload), context).await;

        assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
    }

    #[actix_rt::test]
    async fn update_user_test() {
        let mut user_dao = MockUserDAO::new();
        let refresh_token_dao = MockRefreshTokenDAO::new();

        user_dao.expect_update().returning(|_, _| Ok(()));

        let context = build_context(user_dao, refresh_token_dao);

        let payload = UpdateUser {
            first_name: None,
            last_name: None,
            username: Some("new-test-username".to_string()),
            avatar: None,
        };

        let request = test::TestRequest::put()
            .header("authorization", "test-token")
            .to_http_request();

        let resp = route(request, web::Json(payload), context).await;

        assert_eq!(resp.status(), StatusCode::OK);
    }
}
