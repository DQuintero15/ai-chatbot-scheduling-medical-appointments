import amqp from "amqplib";
import { AMQP_URL } from "src/config";

export const sendMessage = async (queue: string, message: string) => {
  const connection = await amqp.connect(AMQP_URL);
  const channel = await connection.createChannel();

  channel.assertQueue(queue, { durable: false });
  channel.sendToQueue(queue, Buffer.from(message));

  console.log(`[x] Sent ${message}`);
  setTimeout(() => {
    connection.close();
  }, 500);
};
