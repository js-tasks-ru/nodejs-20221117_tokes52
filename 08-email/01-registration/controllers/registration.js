const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const verificationToken = uuid();
  const {displayName, email, password} = ctx.request.body;
  if (!displayName || !email || !password) {
    return ctx.throw(400, 'Не валидная информация о пользователе');
  }

  const user = await User.create({
    displayName,
    email,
    verificationToken,
  });

  await user.setPassword(password);
  await user.save();

  await sendMail({
    template: 'confirmation',
    locals: {token: verificationToken},
    to: email,
    subject: 'Подтвердите почту',
  });
  ctx.body = {status: 'ok'};
  return;
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  const user = await User.findOne({verificationToken});

  if (!user) {
    return ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  }

  user.verificationToken = undefined;
  await user.save();
  const token = await ctx.login(user);

  ctx.body = {token};
  return;
};
