const flat = require('flat');

module.exports = flat({
  name: '姓名',
  avatar: '头像',
  did: 'DID',
  email: '邮箱',
  role: '角色',
  lastLogin: '上次登录',
  createdAt: '创建时间',
  buy: {
    title: 'Payment Required',
    scan: 'Scan with DID Wallet',
    confirm: 'Review and complete the purchase with DID Wallet',
    success: 'Purchase success',
  },
});
