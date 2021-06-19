use lapin::{Channel, message::Delivery, Error};

pub type AMQPDelivery = Result<(Channel, Delivery), Error>;

pub trait BaseAMQPHandler {
    fn handle_delivery(&mut self, delivery: AMQPDelivery);
}
