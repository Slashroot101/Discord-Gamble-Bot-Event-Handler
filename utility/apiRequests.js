const request = require('request-promise');
const config = require('../config');

exports.getExpiredLotteries= async () => {
  return new Promise(async(resolve) => {
    const options = {
      method: 'GET',
      uri: `${config.apiUrl}/lottery/expired`,
      json: true
    };

    const expiredLotteries = await request(options);
    resolve(expiredLotteries.data.lottery);
  });
};

exports.setLotteryConsumed = async (lotteryIDs)  => {
  return new Promise(async(resolve) => {
    const options = {
      method: 'PUT',
      uri: `${config.apiUrl}/lottery/queue/status`,
      body: {
        lotteryIds : lotteryIDs,
      },
      json: true
    };

    const expiredLotteries = await request(options);
    console.log(expiredLotteries)
    resolve(expiredLotteries.data);
  });
};


