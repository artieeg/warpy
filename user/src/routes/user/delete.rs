use crate::context::WarpyContext;
use crate::dao::*;
use actix_web::{delete, web, HttpRequest, HttpResponse};
use std::sync::Mutex;

pub async fn delete<U, R>(
    path: web::Path<String>,
    data: web::Data<Mutex<WarpyContext<U, R>>>,
) -> HttpResponse
where
    U: UserDAOExt,
    R: RefreshTokenDAOExt,
{
    let id = path.0;

    HttpResponse::NotImplemented().finish()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::dao::mocks::*;
    use crate::fixtures::*;
    use actix_web::http::StatusCode;
    use crate::errors::dao::*;

    use actix_rt;

    #[actix_rt::test]
    async fn delete_not_found_test() {
        let mut user_dao = MockUserDAO::new();
        let mut refresh_token_dao = MockRefreshTokenDAO::new();

        user_dao.expect_del_user().returning(|_| {
            Err(DAOError::NotFound)
        });

        refresh_token_dao.expect_del_token().returning(|_| {
            Ok(())
        });

        let context = build_context(user_dao, refresh_token_dao);

        let response = delete(web::Path("/user/test_user_id".to_string()), context).await;
        assert_eq!(response.status(), StatusCode::NOT_FOUND);
    }

    #[actix_rt::test]
    async fn delete_success_test() {
        let mut user_dao = MockUserDAO::new();
        let mut refresh_token_dao = MockRefreshTokenDAO::new();

        refresh_token_dao.expect_del_token().returning(|_| {
            Ok(())
        });

        user_dao.expect_del_user().returning(|_| {
            Ok(())
        });

        let context = build_context(user_dao, refresh_token_dao);

        let response = delete(web::Path("/user/test_user_id".to_string()), context).await;
        assert_eq!(response.status(), StatusCode::OK);
    }
}
