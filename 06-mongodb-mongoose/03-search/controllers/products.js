
const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.request.query;

  if (!query) {
    ctx.body = {products: []};
    return next();
  }

  const products = await Product.find({
    $text: {$search: query},
  });
  ctx.body = {products: products.map(mapProduct)};
};
