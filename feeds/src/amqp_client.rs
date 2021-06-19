use async_trait::async_trait;
use lapin::{Channel, Connection, ConnectionProperties};

#[async_trait]
pub trait AMQPClientExt {
    async fn connect(&mut self);
}

pub struct AMQPClient {
    connection: Option<Connection>,
    channel: Option<Channel>,
}

impl AMQPClient {
    pub fn new() -> Self {
        Self {
            connection: None,
            channel: None,
        }
    }

    fn get_connection(&self) -> &Connection {
        return self.connection.as_ref().unwrap();
    }
}

#[async_trait]
impl AMQPClientExt for AMQPClient {
    async fn connect(&mut self) {
        let uri = std::env::var("AMQP_URI").unwrap();
        self.connection = Some(
            Connection::connect(&uri, ConnectionProperties::default())
                .await
                .expect("Connecting to AMQP service"),
        );

        self.channel = Some(
            self.get_connection()
                .create_channel()
                .await
                .expect("Create channel"),
        );
    }
}
