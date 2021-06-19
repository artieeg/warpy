use super::{AMQPDelivery, BaseAMQPHandler};

pub struct NewStreamAMQPHandler {}

impl NewStreamAMQPHandler {
    pub fn new() -> Self {
        Self {}
    }
}

impl BaseAMQPHandler for NewStreamAMQPHandler {
    fn handle_delivery(&self, delivery: AMQPDelivery) {
        let (_, delivery) = delivery.expect("error in consumer");
        let payload = std::str::from_utf8(&delivery.data);

        println!("payload {:#?}", payload);
    }
}
