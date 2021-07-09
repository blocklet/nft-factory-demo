/* eslint-disable no-console */
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fallback = require('express-history-api-fallback');

const isProduction = process.env.NODE_ENV !== 'development';

// Create and config express application
const app = express();
app.use(compression());
app.set('trust proxy', true);
app.use(cookieParser());
app.use(bodyParser.json({ limit: '1 mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1 mb' }));
app.use(cors());

app.use(
  morgan((tokens, req, res) => {
    const log = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
    ].join(' ');

    return log;
  })
);

app.use((req, res, next) => {
  if (req.headers['x-user-did']) {
    req.user = {
      did: req.headers['x-user-did'],
      role: req.headers['x-user-role'],
      fullName: decodeURIComponent(req.headers['x-user-fullname']),
    };
  }
  next();
});

const router = express.Router();

require('../handlers').init(router);
require('../routes/user').init(router);
require('../routes/nft').init(router);

if (isProduction) {
  app.use(compression());
  app.use(router);

  const staticDir = path.resolve(__dirname, '../../', 'build');
  app.use(express.static(staticDir, { maxAge: '365d', index: false }));
  app.use(fallback('index.html', { root: staticDir }));

  app.use((req, res) => {
    res.status(404).send('404 NOT FOUND');
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
} else {
  app.use(router);
}

exports.app = app;
