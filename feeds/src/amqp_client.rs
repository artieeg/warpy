use async_trait::async_trait;
use futures::StreamExt;
use lapin::{
    options::{BasicConsumeOptions, QueueDeclareOptions},
    types::FieldTable,
    Channel, Connection, ConnectionProperties,
};
use std::sync::{Arc, RwLock};

#[async_trait]
pub trait AMQPClientExt {
    async fn connect(&mut self, connection: &Connection);
    async fn on_new_stream(&mut self);
}

#[derive(Clone)]
pub struct AMQPClient {
    channel: Option<Channel>,
}

impl AMQPClient {
    pub fn new() -> Self {
        Self { channel: None }
    }

    /*
    fn get_channel(&self) -> &Channel {
        self.channel.read().unwrap().as_ref().unwrap()
    }

    fn get_connection(&self) -> &Connection {
        self.connection.read().unwrap().as_ref().unwrap()
    }
    */
}

#[async_trait]
impl AMQPClientExt for AMQPClient {
    async fn connect(&mut self, connection: &Connection) {
        self.channel = Some(connection.create_channel().await.expect("Create channel"));
    }

    async fn on_new_stream(&mut self) {
        let channel = self.channel.as_ref().unwrap();
        channel
            .queue_declare(
                "stream.created",
                QueueDeclareOptions::default(),
                FieldTable::default(),
            )
            .await
            .expect("stream.created queue declare");

        let mut consume = channel
            .basic_consume(
                "stream.created",
                "",
                BasicConsumeOptions::default(),
                FieldTable::default(),
            )
            .await
            .expect("Consuming stream.created queue");

        while let Some(delivery) = consume.next().await {
            println!("delivery {:#?}", delivery);
        }
    }
}
