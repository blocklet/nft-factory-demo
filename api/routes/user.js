const { authClient } = require('../libs/auth');

module.exports = {
  init(app) {
    app.get('/api/did/user', async (req, res) => {
      res.json({
        user: req.user,
      });
    });

    app.get('/api/user', async (req, res) => {
      if (!req.user) {
        res.json({
          user: null
        });
        return;
      }
      const { user } = await authClient.getUser(req.user.did);
      res.json({
        user
      });
    });
  },
};
