const config = require('./config.js');
const rabbitMQ = require('amqplib');
const request = require('request-promise');
const Poller = require('./utility/Poll');

let poller = new Poller(config.pollingInterval);

poller.onPoll(async () => {
  const expiredLotteries = await getExpiredLotteries();
  console.log(expiredLotteries);
  poller.poll();
});

poller.poll();

async function getExpiredLotteries(){
  return new Promise(async(resolve) => {
    const options = {
      method: 'GET',
      uri: `${config.apiUrl}/lottery/expired`,
      json: true
    };

    const expiredLotteries = await request(options);
    resolve(expiredLotteries.data.lottery);
  });
}