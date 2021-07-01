use lapin::{Channel, message::Delivery, Error};

pub type AMQPDelivery = Result<(Channel, Delivery), Error>;

#[async_trait::async_trait]
pub trait BaseAMQPHandler {
    async fn handle_delivery(&self, delivery: AMQPDelivery);
}
