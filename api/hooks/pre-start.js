require('dotenv-flow').config();

const Client = require('@ocap/client');

const env = require('../libs/env');
const logger = require('../libs/logger');
const { wallet } = require('../libs/auth');
const { factoryItx } = require('../libs/factory');

const client = new Client(env.chainHost);

const ensureAccountDeclared = async () => {
  const { BLOCKLET_DID = '', BLOCKLET_REAL_DID = '' } = process.env;
  if (BLOCKLET_DID && BLOCKLET_REAL_DID && BLOCKLET_REAL_DID !== BLOCKLET_DID) {
    return;
  }

  const { state } = await client.getAccountState({ address: wallet.toAddress() }, { ignoreFields: ['context'] });
  if (!state) {
    const hash = await client.declare({ moniker: 'nft-factory-demo', wallet });
    logger.info(`app account declared on chain ${env.chainHost}`, hash);
  } else {
    logger.info(`app account already declared on chain ${env.chainHost}`);
  }
};

const ensureFactoryCreated = async itx => {
  const { state } = await client.getFactoryState({ address: itx.address });
  if (!state) {
    const hash = await client.sendCreateFactoryTx({ tx: { itx }, wallet });
    logger.info(`factory created on chain ${itx.address}`, hash);
  } else {
    logger.info(`factory exist on chain ${itx.address}`);
  }

  return state;
};

(async () => {
  try {
    await ensureAccountDeclared();
    await ensureFactoryCreated(factoryItx);
    process.exit(0);
  } catch (err) {
    logger.error('nft-factory-demo pre-start error', err.message);
    process.exit(1);
  }
})();
