use crate::dao::*;

use base_amqp_handler::{AMQPDelivery, BaseAMQPHandler};
use crate::payloads::user::AMQPGet;
use lapin::{options::BasicPublishOptions, BasicProperties};
use serde_json::Result;

pub struct RequestUserAMQPHandler {
    user_dao: UserDAO,
}

impl RequestUserAMQPHandler {
    pub fn new(user_dao: UserDAO) -> Self {
        Self { user_dao }
    }

    pub fn get_id(payload: &str) -> Result<String> {
        let payload: AMQPGet = serde_json::from_str(payload)?;

        return Ok(payload.id);
    }
}

#[async_trait::async_trait]
impl BaseAMQPHandler for RequestUserAMQPHandler {
    async fn handle_delivery(&self, delivery: AMQPDelivery) {
        println!("requesting user");
        let (ch, delivery) = delivery.expect("error in consumer");
        let payload = match std::str::from_utf8(&delivery.data) {
            Ok(p) => p,
            Err(_) => return,
        };

        let requested_id = match RequestUserAMQPHandler::get_id(payload) {
            Ok(id) => id,
            Err(_) => return
        };
        println!("user id {}", requested_id);

        let correlation_id = delivery
            .properties
            .correlation_id()
            .as_ref();

        let reply_queue = delivery
            .properties
            .reply_to()
            .as_ref();

        if correlation_id.is_none() || reply_queue.is_none() {
            return;
        }

        let correlation_id = correlation_id.unwrap();
        let reply_queue = reply_queue.unwrap().as_str();

        if let Some(user) = self.user_dao.get(&requested_id).await {
            ch.basic_publish(
                "",
                reply_queue,
                BasicPublishOptions::default(),
                serde_json::to_vec(&user).expect("user model serialization"),
                BasicProperties::default().with_correlation_id(correlation_id.clone()),
            )
            .await
            .unwrap();
        }
    }
}
