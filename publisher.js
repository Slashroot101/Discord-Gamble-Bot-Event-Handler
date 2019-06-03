const config = require('./config.js');
const nats = require('nats');
const moment = require('moment');

const Poller = require('./utility/Poll');
const {getLotteries, updateLottery} = require('./utility/apiRequests');
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
      const expiredLotteries = await getLotteries({endDate: new Date().toISOString(), isDone: false, isQueued: false});
      console.log(`Fetched ${expiredLotteries.length} expired lotteries!`);
      expiredLotteries.forEach(async element => {
        queue.publish(TOPIC_NAME, Buffer.from(JSON.stringify(element)));
        await updateLottery(element._id, {isQueued: true});
      });
    } catch (err){
      console.log(err)
    }
}

async function createGlobalLottery(){
  const lastGlobalLottery = await getLotteries({isDone: true, isQueued: true, localityType: 'Guild', sort: -1});
  
}

async function determineNextGlobalLotteryDate(lastLotteryDate, minDays, maxDays){
  const startDays = Math.floor(Math.random() * maxDays) + minDays;
  const endDays = Math.floor(Math.random() * startDays) + startDays;
  return {startDate: moment(lastLotteryDate).add(startDays, 'days'), endDate: moment(lastLotteryDate).add(endDays, 'days')};
}
