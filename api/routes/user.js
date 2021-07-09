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
        return res.json({ user: null });
      }
      const { user } = await authClient.getUser(req.user.did);
      return res.json({ user });
    });
  },
};
