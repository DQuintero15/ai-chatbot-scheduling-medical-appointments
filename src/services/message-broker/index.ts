import amqp from "amqplib";
import { AMQP_URL } from "src/config";

interface IMessageBrokerService {
  sendMessage(queue: string, message: string): Promise<void>;
}

export class MessageBrokerService implements IMessageBrokerService {
  sendMessage = async (queue: string, message: string) => {
    const connection = await amqp.connect(AMQP_URL);
    const channel = await connection.createChannel();

    channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(message));

    console.log(`[x] Sent ${message}`);
    setTimeout(() => {
      connection.close();
    }, 500);
  };
}
