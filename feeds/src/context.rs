use crate::dao::feed::*;

pub struct WarpyContext<F: FeedDAOExt> {
    pub feed_dao: F,
}

impl<F: FeedDAOExt> WarpyContext<F> {
    pub fn create(feed_dao: F) -> Self {
        Self {
            feed_dao
        }
    }
}
