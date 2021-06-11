use crate::context::WarpyContext;
use crate::dao::*;
use actix_web::{web, HttpRequest, HttpResponse};
use std::sync::Mutex;

pub async fn route<U, R>(
    req: HttpRequest,
    path: web::Path<String>,
    data: web::Data<Mutex<WarpyContext<U, R>>>,
) -> HttpResponse
where
    U: UserDAOExt,
    R: RefreshTokenDAOExt,
{
    let auth_user_id = req.headers().get("user-id").unwrap().to_str().unwrap();
    let user_id = path.0.as_str();

    if auth_user_id != user_id {
        return HttpResponse::Forbidden().finish();
    }

    let data = data.lock().unwrap();

    match data.user_dao.delete(user_id).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(e) => e.into(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::dao::mocks::*;
    use crate::errors::dao::*;
    use crate::fixtures::*;
    use actix_web::http::StatusCode;
    use actix_web::test;

    use actix_rt;

    #[actix_rt::test]
    async fn check_permission_test() {
        let mut user_dao = MockUserDAO::new();
        let mut refresh_token_dao = MockRefreshTokenDAO::new();

        user_dao
            .expect_delete()
            .returning(|_| Err(DAOError::NotFound));

        refresh_token_dao.expect_delete().returning(|_| Ok(()));

        let context = build_context(user_dao, refresh_token_dao);

        let req = test::TestRequest::delete()
            .header("user-id", "another-id")
            .to_http_request();
        let response = route(req, web::Path("test_user_id".to_string()), context).await;
        assert_eq!(response.status(), StatusCode::FORBIDDEN);
    }

    #[actix_rt::test]
    async fn delete_not_found_test() {
        let mut user_dao = MockUserDAO::new();
        let mut refresh_token_dao = MockRefreshTokenDAO::new();

        user_dao
            .expect_delete()
            .returning(|_| Err(DAOError::NotFound));

        refresh_token_dao.expect_delete().returning(|_| Ok(()));

        let context = build_context(user_dao, refresh_token_dao);

        let req = test::TestRequest::delete()
            .header("user-id", "test_user_id")
            .to_http_request();
        let response = route(req, web::Path("test_user_id".to_string()), context).await;
        assert_eq!(response.status(), StatusCode::NOT_FOUND);
    }

    #[actix_rt::test]
    async fn delete_success_test() {
        let mut user_dao = MockUserDAO::new();
        let mut refresh_token_dao = MockRefreshTokenDAO::new();

        refresh_token_dao.expect_delete().returning(|_| Ok(()));

        user_dao.expect_delete().returning(|_| Ok(()));

        let context = build_context(user_dao, refresh_token_dao);

        let req = test::TestRequest::delete()
            .header("user-id", "test_user_id")
            .to_http_request();
        let response = route(req, web::Path("test_user_id".to_string()), context).await;
        assert_eq!(response.status(), StatusCode::OK);
    }
}
