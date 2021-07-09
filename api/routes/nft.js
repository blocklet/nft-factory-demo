const { fromJSON } = require('@ocap/wallet');
const { createCredentialList } = require('@arcblock/vc');

const ensureVc = require('../middlewares/ensureVc');
const { wallet } = require('../libs/auth');
const env = require('../libs/env');
const { factoryDisplay } = require('../libs/factory');

const translations = {
  view: {
    zh: '查看站点',
    en: 'View Website',
  },
};

module.exports = {
  init(app) {
    app.get('/api/nft/display', async (req, res) => {
      res.type('svg');
      res.send(factoryDisplay);
    });

    app.get('/api/nft/status', ensureVc, async (req, res) => {
      const { vc } = req;
      const issuer = { wallet: fromJSON(wallet), name: 'nft-factory-demo' };
      const locale = req.query.locale || 'en';
      const data = {
        id: vc.id,
        description: 'Status and Actions of NFT Factory Demo',
        statusList: [],
        actionList: createCredentialList({
          issuer,
          claims: [
            {
              id: `${env.serverUrl}`,
              type: 'navigate',
              name: 'view-blocklet',
              scope: 'public',
              label: translations.view[locale],
            },
          ],
        }),
      };
      res.json(data);
    });
  },
};
