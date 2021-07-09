/* eslint-disable arrow-parens */
const { decodeAny } = require('@ocap/message');
const { fromAddress } = require('@ocap/wallet');

const logger = require('../libs/logger');
const { wallet } = require('../libs/auth');
const { client } = require('../libs/chain');
const { factoryItx, factoryDisplay } = require('../libs/factory');

module.exports = {
  action: 'buy-vip',
  claims: {
    signature: async ({ userPk, userDid }) => {
      const expireAt = Date.now() + 365 * 24 * 3600 * 1000;
      const expireDate = new Date();
      expireDate.setTime(expireAt);

      const preMint = await client.preMintAsset({
        factory: factoryItx.address,
        inputs: { expirationDate: expireDate.toISOString() },
        owner: userDid,
        wallet,
      });
      logger.info('buy.claim.preMint', preMint);
      return {
        type: 'AcquireAssetV2Tx',
        display: JSON.stringify({ type: 'svg', content: factoryDisplay }),
        data: {
          from: userDid,
          pk: userPk,
          itx: preMint,
        },
      };
    },
  },

  onAuth: async ({ claims, userDid, token, storage }) => {
    const claim = claims.find((x) => x.type === 'signature');

    const tx = client.decodeTx(claim.origin);
    tx.signature = claim.sig;

    // support user payment using delegation
    if (claim.delegator && claim.from) {
      tx.delegator = claim.delegator;
      tx.from = claim.from;
    }

    const { value } = decodeAny(tx.itx);
    const { address } = value;

    logger.info('buy.auth.tx', tx);
    const hash = await client.sendAcquireAssetV2Tx({ tx, wallet: fromAddress(userDid) });
    logger.info('buy.auth.hash', hash);
    storage.update(token, { assetDid: address });

    // return the nft(vc) if exists
    try {
      const { state } = await client.getAssetState({ address }, { ignoreFields: ['context'] });
      if (state && state.data && state.data.typeUrl === 'vc') {
        const vc = JSON.parse(state.data.value);
        logger.error('buy.auth.vc', vc);
        return {
          disposition: 'attachment',
          type: 'VerifiableCredential',
          data: vc,
          tag: address,
          assetId: address,
          hash,
          tx: claim.origin,
        };
      }
    } catch (err) {
      logger.error('buy.auth.asset.error', err);
    }

    // return the tx hash
    return { hash, tx: claim.origin };
  },
};
