const config = require('./config.js');
const rabbitMQ = require('amqplib');

const Poller = require('./utility/Poll');
const {getExpiredLotteries} = require('./utility/apiRequests');
let poller = new Poller(config.pollingInterval);

main();

async function main(){
  const queue = await rabbitMQ.connect(config.rabbitMQ);
  const channel = await queue.createChannel();
  poller.onPoll(async () => {
    await Promise.all([
      queueExpiredLotteries(channel)
    ]);
    poller.poll();
  });
}

async function queueExpiredLotteries(channel){
  const TOPIC_NAME = "lottery";
  await channel.assertQueue(TOPIC_NAME, {durable:true});
    try {
      const expiredLotteries = await getExpiredLotteries();
      expiredLotteries.forEach(element => {
        channel.sendToQueue(TOPIC_NAME, Buffer.from(JSON.stringify(element)))
      });
    } catch (err){
      console.log(err)
    }
    poller.poll();
}

poller.poll();