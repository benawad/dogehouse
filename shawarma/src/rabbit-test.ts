import amqp from "amqplib";

const main = async () => {
  console.log("connecting...");
  const conn = await amqp.connect(
    process.env.RABBITMQ_URL || "amqp://localhost"
  );
  console.log("good...");
  const id = process.env.QUEUE_ID || "";
  const channel = await conn.createChannel();
  console.log("channel...");
  const receiveQueue = "shawarma_queue" + id;
  await Promise.all([channel.assertQueue(receiveQueue)]);
  console.log("assert...");
  await channel.purgeQueue(receiveQueue);
  console.log("purge...");
  await channel.consume(receiveQueue, async (e) => {
    console.log(e?.content);
  });
  console.log("consume...");
  channel.sendToQueue(receiveQueue, Buffer.from(JSON.stringify("hey")));
};

main();
