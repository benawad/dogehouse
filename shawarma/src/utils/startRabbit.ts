import amqp from "amqplib";
import * as Sentry from "@sentry/node";

export type HandlerMap = Record<
  string,
  (
    d: any,
    uid: string,
    send: (
      d: {
        op: string;
        platform: "web" | "vscode" | "all";
        d: any;
      } & (
        | {
            uid: string;
          }
        | {
            rid: string;
          }
      )
    ) => void,
    errBack: () => void
  ) => void
>;

export let send = (_obj: any) => {};

export const startRabbit = async (handler: HandlerMap) => {
  console.log(
    "trying to connect to: ",
    process.env.RABBITMQ_URL || "amqp://localhost"
  );
  const conn = await amqp.connect(
    process.env.RABBITMQ_URL || "amqp://localhost"
  );
  const id = process.env.QUEUE_ID || "";
  console.log("rabbit connected " + id);
  const channel = await conn.createChannel();
  const sendQueue = "kousa_queue" + id;
  const onlineQueue = "kousa_online_queue" + id;
  const receiveQueue = "shawarma_queue" + id;
  console.log(sendQueue, onlineQueue, receiveQueue);
  await Promise.all([
    channel.assertQueue(receiveQueue),
    channel.assertQueue(sendQueue),
    channel.assertQueue(onlineQueue),
  ]);
  send = (obj: any) => {
    channel.sendToQueue(sendQueue, Buffer.from(JSON.stringify(obj)));
  };
  await channel.purgeQueue(receiveQueue);
  await channel.consume(
    receiveQueue,
    async (e) => {
      const m = e?.content.toString();
      if (m) {
        let data: any = null;
        try {
          data = JSON.parse(m);
        } catch {}
        // console.log(data.op);
        if (data && data.op && data.op in handler) {
          try {
            console.log(data.op);
            await handler[data.op](data.d, data.uid, send, () => {
              console.log(data.op);
              send({
                op: "error",
                platform: "vscode",
                d:
                  "The voice server is probably redeploying, it should reconnect in a few seconds. If not, try refreshing.",
                uid: data.uid,
              });
            });
          } catch (err) {
            console.log(data.op, err);
            Sentry.captureException(err, { extra: { op: data.op } });
          }
        }
      }
    },
    { noAck: true }
  );
  channel.sendToQueue(
    onlineQueue,
    Buffer.from(JSON.stringify({ op: "online" }))
  );
};
