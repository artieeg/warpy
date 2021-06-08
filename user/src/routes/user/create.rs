use crate::errors::user::UserAlreadyExistsError;
use crate::jwt::{Claims, TokenType};
use crate::payloads::user;
use crate::models::{RefreshToken, User};
use crate::context::WarpyContext;
use crate::dao::{user::*, refresh_token::*};
use actix_web::{web, HttpResponse};
use serde_json::json;
use std::convert::TryFrom;
use std::sync::Mutex;

pub async fn create<U, R>(
    payload: web::Json<user::CreateWithPassword>,
    data: web::Data<Mutex<WarpyContext<U, R>>>,
) -> HttpResponse where U: UserDAOExt, R: RefreshTokenDAOExt {
    let user = match User::try_from(payload.into_inner()) {
        Ok(user) => user,
        Err(e) => return e.into(),
    };

    let id = user.id.clone();
    let username = user.username.clone();
    let email = user.email.clone();

    let refresh = Claims::new(&user, TokenType::Refresh).unwrap();
    let access = Claims::new(&user, TokenType::Access).unwrap();

    let data = data.lock().unwrap();

    //Check if user already exists
    let existing_user = data
        .user_dao
        .find_user(username.as_str(), email.as_str())
        .await;

    if let Some(existing_user) = existing_user {
        let same_username = existing_user.username == username;
        let same_email = existing_user.email == email;

        let error = UserAlreadyExistsError {
            same_username,
            same_email,
        };

        return error.into();
    }

    //Save refresh token to the DB
    if let Err(e) = data
        .refresh_token_dao
        .add_token(RefreshToken::new(&id, &refresh))
        .await
    {
        //Return an error if any
        return e.into();
    }

    match data.user_dao.add_user(user).await {
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

    use crate::dao::{user::*, refresh_token::*};
    use crate::payloads::user::CreateWithPassword;
    use crate::context::WarpyContext;
    use actix_web::{http::StatusCode, test, web};
    use serde_json::json;
    use crate::errors::dao::DAOInsertError;
    use mockall::*;
    use mockall::predicate::*;
    use async_trait::async_trait;

    mock! {
        pub RefreshTokenDAO {  }
        #[async_trait]
        impl RefreshTokenDAOExt for RefreshTokenDAO {
            async fn add_token(&self, token: RefreshToken) -> Result<(), DAOInsertError>;
        }
    }

    mock! {
        pub UserDAO {  }
        #[async_trait]
        impl UserDAOExt for UserDAO {
            async fn add_user<'a>(&'a self, user: User) -> Result<(), DAOInsertError>;
            async fn find_user<'a>(&'a self, username: &'a str, email: &'a str) -> Option<User>;
            async fn get_user<'a>(&'a self, id: &'a str) -> Option<User>;
        }
    }

    #[actix_rt::test]
    async fn create_user_test() {
        let mut user_dao = MockUserDAO::new();
        let mut refresh_token_dao = MockRefreshTokenDAO::new();

        user_dao.expect_find_user().returning(|_, _| None);
        refresh_token_dao.expect_add_token().returning(|_| Ok(()));
        user_dao.expect_add_user().returning(|_| Ok(()));

        let context = web::Data::new(Mutex::new(WarpyContext::create(user_dao, refresh_token_dao)));

        let payload = web::Json(CreateWithPassword {
            first_name: "John".to_string(),
            last_name: "Dou".to_string(),
            username: "somebody".to_string(),
            password: "test_password".to_string(),
            avatar: "avatar".to_string(),
            email: "jd@test.com".to_string()
        });

        let resp = create(payload, context).await;

        assert_eq!(resp.status(), StatusCode::OK);
    }
}
