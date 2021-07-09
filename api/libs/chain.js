const Client = require('@ocap/client');

const env = require('./env');

const endpoint = env.chainHost;
const client = new Client(endpoint);

module.exports = {
  client,
};
