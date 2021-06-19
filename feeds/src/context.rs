use crate::{amqp_client::AMQPClientExt, dao::feed::*};

pub struct WarpyContext<F: FeedDAOExt, A: AMQPClientExt> {
    pub feed_dao: F,
    pub amqp_client: A
}

impl<F: FeedDAOExt, A: AMQPClientExt> WarpyContext<F, A> {
    pub fn create(feed_dao: F, amqp_client: A) -> Self {
        Self {
            feed_dao,
            amqp_client
        }
    }
}
