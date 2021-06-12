use crate::dao::*;

pub struct WarpyContext<S: StreamDAOExt, H: HubDAOExt> {
    pub stream_dao: S,
    pub hub_dao: S,
}

impl<S: StreamDAOExt, H: HubDAOExt> WarpyContext<S, H> {
    pub fn create(stream_dao: S, hub_dao: H) -> Self {
        Self {
            stream_dao,
            hub_dao,
        }
    }
}
