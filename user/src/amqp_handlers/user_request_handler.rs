use crate::dao::*;

use super::{BaseAMQPHandler, AMQPDelivery};

pub struct RequestUserAMQPHandler {
    user_dao: UserDAO
}

impl RequestUserAMQPHandler {
    pub fn new(user_dao: UserDAO) -> Self {
        Self {
            user_dao
        }
    }
}

impl BaseAMQPHandler for RequestUserAMQPHandler {
    fn handle_delivery(&self, delivery: AMQPDelivery) {
        let (_, delivery) = delivery.expect("error in consumer");
        let payload = std::str::from_utf8(&delivery.data);

        println!("payload {:#?}", payload);
    }
}
