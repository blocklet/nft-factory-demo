const Notification = require('@blocklet/sdk/service/notification');

const { authClient } = require('../libs/auth');

module.exports = {
  init(app) {
    app.post('/api/notification', async (req, res) => {
      const { type, actions = [] } = req.body.data;
      const userDid = req.user && req.user.did;

      try {
        if (type === 'text') {
          const salt = Math.random();
          const messages = {
            en: {
              title: 'Hello，World',
              body: `This is notification message from NFT Factory Demo: ${salt}`,
            },
            zh: {
              title: '你好，世界',
              body: `这是从 NFT Factory Demo 发送过来的消息: ${salt}`,
            },
          };

          const { user } = await authClient.getUser(userDid);
          const locale = user.locale || 'en';
          const message = messages[locale] || messages.en;

          await Notification.sendToUser(userDid, {
            title: message.title,
            body: message.body,
            actions,
          });

          res.json({ salt });
          return;
        }

        // For more types, please checkout: https://www.npmjs.com/package/@blocklet/sdk

        throw new Error(`unknown type: ${type}`);
      } catch (error) {
        console.error(error);
        res.statusMessage = error.message;
        res.status(400).end();
      }
    });
  },
};
