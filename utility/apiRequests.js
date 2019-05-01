const request = require('request-promise');
const config = require('../config');

exports.getLotteries = async (query) => {
  const options = {
    method: 'GET',
    uri: `${config.apiUrl}/api/lottery`,
    qs: query,
    json: true
  };

  const lotteries = await request(options);
  return lotteries.lotteries;
};

exports.updateLottery = async(id, updatedProperties) => {
  const options = {
    method: 'PUT',
    uri: `${config.apiUrl}/api/lottery/${id}`,
    body: updatedProperties,
    json: true,
  };

  const lottery = await request(options);
  return lottery.lottery;
};


