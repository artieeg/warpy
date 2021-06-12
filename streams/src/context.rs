use crate::dao::*;

pub struct WarpyContext<S: StreamDAOExt> {
    pub stream_dao: S
}

impl<S: StreamDAOExt> WarpyContext<S> {
    pub fn create(stream_dao: S) -> Self {
        Self {
            stream_dao
        }
    }
}
