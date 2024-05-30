const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    company: { type: String, required: false },
    description: { type: String, required: true },
    info: { type: String, required: true },
    price: { type: Number, required: true },
    priceOff: { type: Number, required: true },
    stock: { type: Number, required: false },
    reviews: { type: Number, required: false },
    stars: { type: Number, required: false },
    colors: { type: Object, required: false },
    image: { type: Object, required: false },


  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

exports.Product = Product;
