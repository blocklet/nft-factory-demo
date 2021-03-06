/* eslint-disable no-console */
require('dotenv-flow').config();

const { app } = require('./functions/app');

const isDevelopment = process.env.NODE_ENV === 'development';
if (isDevelopment && process.env.ABT_NODE) {
  process.env.BLOCKLET_PORT = 3030;
}

const port = parseInt(process.env.BLOCKLET_PORT || process.env.APP_PORT, 10) || 3030;
app.listen(port, err => {
  if (err) throw err;
  console.log(`> app ready on ${port}`);
});
