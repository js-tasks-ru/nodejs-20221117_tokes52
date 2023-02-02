const mongoose = require('mongoose');
const connection = require('../libs/connection');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  images: [String],

});

const indexFields = {
  title: 'text',
  description: 'text',
};

const indexOptions = {
  name: 'TextSearchIndex',
  weights: {
    title: 10,
    description: 5,
  },
  default_language: 'russian',
};

productSchema.index(indexFields, indexOptions);

module.exports = connection.model('Product', productSchema);

