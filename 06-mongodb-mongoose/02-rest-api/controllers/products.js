const ObjectId = require('mongoose').Types.ObjectId;
const Product = require('../models/Product');
const mapProduct = require('../mappers/product');


module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) {
    return next();
  }

  const products = await Product.find({subcategory});
  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});
  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.request.params;
  if (!ObjectId.isValid(id) || new ObjectId(id).toString() !== id) {
    ctx.status = 400;
    ctx.body = 'Product ID is invalid';
    return next();
  }

  const product = await Product.findOne({_id: id});
  if (product) {
    ctx.body = {product: mapProduct(product)};
  }

  return next();
};

