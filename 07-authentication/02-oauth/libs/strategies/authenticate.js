const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  try {
    if (!email) {
      done(null, false, 'Не указан email');
      return;
    }

    let user = await User.findOne({email});
    if (!user) {
      user = await User.create({email, displayName});
    }

    done(null, user);
  } catch (err) {

    done(err);
  }
};
