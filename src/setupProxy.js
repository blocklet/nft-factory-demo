/* eslint-disable arrow-parens */
/* eslint-disable import/no-extraneous-dependencies */
require('dotenv-flow').config();

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://127.0.0.1:${process.env.APP_PORT || 3030}`,
    })
  );
};
