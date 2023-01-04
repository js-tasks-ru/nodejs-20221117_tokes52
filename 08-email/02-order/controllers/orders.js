const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body;
  const order = await Order.create({
    product,
    phone,
    address,
    user: ctx.user,
  });
  await order.populate('product');

  await sendMail({
    template: 'order-confirmation',
    locals: {
      id: order.id,
      product: order.product,
    },
    to: ctx.user.email,
    subject: `Ваш заказ #${order.id}`,
  });

  ctx.body = {
    order: order.id,
    status: 'ok',
  };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orderList = await Order.find({user: ctx.user._id});
  ctx.body = {orders: orderList.map(mapOrder)};
};
