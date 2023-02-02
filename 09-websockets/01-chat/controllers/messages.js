const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx) {
  const messageList = await Message.find({chat: ctx.user.id});
  ctx.body = {messages: messageList.map(mapMessage)};
};
