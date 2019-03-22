const config = require('./config.js');
const rabbitMQ = require('amqplib');

const Poller = require('./utility/Poll');
const {getExpiredLotteries} = require('./utility/apiRequests');
let poller = new Poller(config.pollingInterval);

main();

async function main(){
  const queue = await rabbitMQ.connect(config.rabbitMQ);
  const channel = await queue.createChannel();
  await channel.assertQueue(config.topicName, {durable:true});
  poller.onPoll(async () => {
    try {
      const expiredLotteries = await getExpiredLotteries();
      expiredLotteries.forEach(element => {
        channel.sendToQueue(config.topicName, Buffer.from(JSON.stringify(element)))
      });
    } catch (err){
      console.log(err)
    }

    poller.poll();
  });
}

poller.poll();