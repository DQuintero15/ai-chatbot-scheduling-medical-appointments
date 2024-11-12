import amqp from "amqplib";
import { AMQP_URL } from "src/config";

export const recieveMessage = async (queue: string) => {
  const connection = await amqp.connect(AMQP_URL);
  const channel = await connection.createChannel();

  channel.assertQueue(queue, { durable: false });

  console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

  channel.consume(
    queue,
    (msg) => {
      console.log(`[x] Received ${msg.content.toString()}`);
    },
    { noAck: true }
  );
};
