use crate::context::WarpyContext;
use crate::dao::*;
use actix_web::{web, HttpResponse};
use std::sync::Mutex;
use serde_json::json;

pub async fn route<U, R>(
    path: web::Path<String>,
    data: web::Data<Mutex<WarpyContext<U, R>>>,
) -> HttpResponse
where
    U: UserDAOExt,
    R: RefreshTokenDAOExt,
{
    let user_id = path.0.as_str();

    let data = data.lock().unwrap();

    match data.user_dao.get(user_id).await {
        Some(user) => HttpResponse::Ok().json(json! ({
            "result": {
                "user": user
            }
        })),
        None => HttpResponse::NotFound().finish()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::dao::mocks::*;
    use crate::fixtures::*;
    use actix_rt;
    use actix_web::http::StatusCode;

    #[actix_rt::test]
    async fn get_user_test() {
        let mut user_dao = MockUserDAO::new();
        let refresh_token_dao = MockRefreshTokenDAO::new();

        user_dao
            .expect_get()
            .returning(move |_| Some(user_fixture()));

        let context = build_context(user_dao, refresh_token_dao);
        let result = route(web::Path::from("user-id".to_string()), context).await;

        assert_eq!(result.status(), StatusCode::OK);
    }

    #[actix_rt::test]
    async fn get_nonexisting_user_test() {
        let mut user_dao = MockUserDAO::new();
        let refresh_token_dao = MockRefreshTokenDAO::new();

        user_dao.expect_get().returning(move |_| None);

        let context = build_context(user_dao, refresh_token_dao);
        let result = route(web::Path::from("user-id".to_string()), context).await;

        assert_eq!(result.status(), StatusCode::NOT_FOUND);
    }
}
