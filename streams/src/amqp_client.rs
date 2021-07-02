use std::io;

use futures::{join, StreamExt};
use lapin::{
    options::{
        BasicConsumeOptions, BasicPublishOptions, ExchangeDeclareOptions, QueueDeclareOptions,
    },
    protocol::basic::AMQPProperties,
    types::{FieldTable, ShortString},
    Channel, Connection, ConnectionProperties, ExchangeKind,
};
use nanoid::nanoid;

use tokio::task::{JoinHandle, spawn};
use errors::amqp::AMQPError;

use base_amqp_handler::BaseAMQPHandler;
use serde_json::json;

use crate::payloads::AMQPEventNewStream;

#[derive(Clone)]
pub struct AMQPClient {
    channel: Option<Channel>,
}

impl AMQPClient {
    pub fn new() -> Self {
        Self { channel: None }
    }

    pub async fn connect(&mut self) {
        let uri = std::env::var("AMQP_URI").unwrap();
        let connection = Connection::connect(&uri, ConnectionProperties::default())
            .await
            .expect("Connecting to AMQP service");

        self.channel = Some(connection.create_channel().await.expect("Create channel"));
    }

    fn get_channel(&self) -> &Channel {
        self.channel.as_ref().unwrap()
    }

    pub async fn request_user(&mut self, user: String) -> Result<(), AMQPError> {
        let channel = self.get_channel();
        let request = json!({ "id": user });

        let queue = self.get_reply_queue().await;

        let mut consumer = channel
            .basic_consume(
                queue.clone().as_str(),
                user.as_str(),
                BasicConsumeOptions {
                    no_local: false,
                    no_ack: true,
                    exclusive: false,
                    nowait: false,
                },
                FieldTable::default(),
            )
            .await
            .expect("user reply consumer");

        let correlation_id = ShortString::from(nanoid!());

        let result = channel
            .basic_publish(
                "",
                "user.request",
                BasicPublishOptions::default(),
                serde_json::to_vec(&request).unwrap(),
                AMQPProperties::default()
                    .with_correlation_id(correlation_id.clone())
                    .with_reply_to(ShortString::from(queue.clone())),
            )
            .await;

        let handle: JoinHandle<i32> = spawn(async move {
            println!("spawning a task");
            let c_id = correlation_id.clone();

            while let Some(delivery) = consumer.next().await {
                let (_, delivery) = delivery.expect("error in consumer");

                let reply_correlation_id = delivery
                    .properties
                    .correlation_id()
                    .as_ref()
                    .expect("correlation id");

                if *reply_correlation_id == c_id {
                    println!("received a response {}", c_id);

                    return 42;
                }
            }

            return 0;
        });

        handle.await.unwrap();

        match result {
            Err(_) => Err(AMQPError::Publish),
            Ok(_) => Ok(()),
        }
    }

    pub async fn send_new_stream_event<T>(
        &mut self,
        handler: T,
        payload: AMQPEventNewStream,
    ) -> Result<(), AMQPError>
    where
        T: BaseAMQPHandler + Send,
    {
        let channel = self.get_channel();

        channel
            .exchange_declare(
                "stream",
                ExchangeKind::Direct,
                ExchangeDeclareOptions::default(),
                FieldTable::default(),
            )
            .await
            .expect("stream exchange declare");

        let result = channel
            .basic_publish(
                "stream",
                "stream.created",
                BasicPublishOptions::default(),
                serde_json::to_vec(&payload).expect("new stream payload serialization error"),
                AMQPProperties::default(),
            )
            .await;

        match result {
            Ok(_) => Ok(()),
            Err(_) => Err(AMQPError::Publish),
        }
    }

    async fn get_reply_queue(&self) -> String {
        /*
        let channel = self.get_channel();

        let queue = channel
            .queue_declare(
                "streams.user.request.reply",
                QueueDeclareOptions {
                    durable: false,
                    exclusive: false,
                    auto_delete: false,
                    nowait: false,
                    ..Default::default()
                },
                FieldTable::default(),
            )
            .await
            .expect("reply queue error");

        queue.name().to_string()
        */
        "amq.rabbitmq.reply-to".to_string()
    }
}
