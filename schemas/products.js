let mongoose = require('mongoose');
const slugify = require('slugify');

let productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        unique: true
    },
    price: {
        type: Number,
        min: 0,
        default: 0
    },
    description: {
        type: String,
        default: true,
        maxLength: 999
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'category',
        required: true
    },
    images: {
        type: [String],
        default: [
            "https://placeimg.com/640/480/any"
        ]
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

productSchema.post("save", async function(doc) {
  const Inventory = require('./inventory');
  let newInventory = new Inventory({
    product: doc._id,
    stock: 0,
    reserved: 0,
    soldCount: 0
  });
  await newInventory.save();
  console.log(`Inventory created for product: ${doc.title}`);
});

module.exports = new mongoose.model('product', productSchema)