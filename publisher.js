const config = require('./config.js');
const nats = require('nats');


const Poller = require('./utility/Poll');
const {getExpiredLotteries, setLotteryConsumed, completeLottery} = require('./utility/apiRequests');
let poller = new Poller(config.pollingInterval);

main();
poller.poll();

async function main(){
  try {
    const queue = await nats.connect({url: config.nats});
    poller.onPoll(async () => {
      await Promise.all([
        queueExpiredLotteries(queue),
      ]);
    poller.poll();
  });
  } catch (err){
    console.log(err)
  }
}

async function queueExpiredLotteries(queue){
  const TOPIC_NAME = "lottery";
    try {
      const expiredLotteries = await getExpiredLotteries();
      const consumedLotteryIds = [];
      expiredLotteries.forEach(element => {
        queue.publish(TOPIC_NAME, Buffer.from(JSON.stringify(element)));
        consumedLotteryIds.push(element.id);
      });
      await setLotteryConsumed(consumedLotteryIds);
    } catch (err){
      console.log(err)
    }
}

