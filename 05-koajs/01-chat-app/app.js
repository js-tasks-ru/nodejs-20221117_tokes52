const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscribers = new Set();

router.get('/subscribe', async (ctx) => {
  const message = await new Promise((resolve) => {
    subscribers.add(resolve);
  });

  ctx.status = 200;
  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const {message} = ctx.request.body;

  if (message) {
    subscribers.forEach((subscriber) => {
      subscriber(message);
    });
    subscribers.clear();
  }

  ctx.body = 'OK';
});

app.use(router.routes());

module.exports = app;
