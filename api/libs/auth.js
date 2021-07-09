const path = require('path');
const AuthStorage = require('@arcblock/did-auth-storage-nedb');
const AuthService = require('@blocklet/sdk/service/auth');
const WalletAuthenticator = require('@blocklet/sdk/lib/wallet-authenticator');
const { types } = require('@ocap/mcrypto');
const { fromSecretKey, WalletType } = require('@ocap/wallet');
const { WalletHandlers } = require('@arcblock/did-auth');

const wallet = fromSecretKey(process.env.BLOCKLET_APP_SK, WalletType({ role: types.RoleType.ROLE_APPLICATION }));

const authenticator = new WalletAuthenticator();

const handlers = new WalletHandlers({
  authenticator,
  tokenGenerator: () => Date.now().toString(),
  tokenStorage: new AuthStorage({
    dbPath: path.join(process.env.BLOCKLET_DATA_DIR, 'auth.db'),
    onload: (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(`Failed to load database from ${path.join(process.env.BLOCKLET_DATA_DIR, 'auth.db')}`, err);
      }
    },
  }),
});

const authClient = new AuthService();

module.exports = {
  authenticator,
  handlers,
  wallet,
  authClient,
};
