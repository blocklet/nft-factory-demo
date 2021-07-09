const { handlers } = require('../libs/auth');

const buyVip = require('./buy-vip');

module.exports = {
  init(app) {
    handlers.attach({ app, ...buyVip });
  },
};
