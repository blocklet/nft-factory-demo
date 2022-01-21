const blockletRealDid = process.env.BLOCKLET_REAL_DID || '';
const blockletDid = process.env.BLOCKLET_DID || '';
const isComponent = blockletRealDid !== blockletDid;

module.exports = {
  chainHost: process.env.CHAIN_HOST || '',
  appId: process.env.BLOCKLET_APP_ID || '',
  appName: process.env.BLOCKLET_APP_NAME || 'NFT Factory Demo',
  appDescription: process.env.BLOCKLET_APP_DESCRIPTION || 'NFT Factory demo blocklet',
  appUrl: process.env.BLOCKLET_APP_URL || '',
  vipPrice: Number(process.env.VIP_PRICE || 10),
  isComponent,
};
