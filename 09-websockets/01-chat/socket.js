const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server, {
    allowEIO3: true,
  });

  io.use(async function(socket, next) {
    const {query} = socket.handshake;
    if (!query.token) {
      return next(new Error('anonymous sessions are not allowed'));
    }

    const session = await Session.findOne({token: query.token});

    if (!session) {
      return next(new Error('wrong or expired session token'));
    }

    await session.populate('user');
    socket.user = session.user;
    next();
  });


  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      await Message.create({
        chat: socket.user.id,
        date: new Date(),
        text: msg,
        user: socket.user.displayName,
      });
    });
  });

  return io;
}

module.exports = socket;
