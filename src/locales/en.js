const flat = require('flat');

module.exports = flat({
  name: 'Name',
  avatar: 'Avatar',
  did: 'DID',
  email: 'Email',
  role: 'Role',
  lastLogin: 'Last Login',
  createdAt: 'Created At',
  buy: {
    title: 'Payment Required',
    scan: 'Scan with DID Wallet',
    confirm: 'Review and complete the purchase with DID Wallet',
    success: 'Purchase success',
  },
});
