const Inventory = require('../schemas/inventory');

const updateStock = async (productId, quantity) => {
  return await Inventory.findOneAndUpdate(
    { product: productId },
    { $inc: { stock: quantity } },
    { new: true }
  );
};

const reservation = async (productId, quantity) => {
  const inventory = await Inventory.findOne({ product: productId });
  if (inventory.stock < quantity) {
    throw new Error('Not enough stock for reservation');
  }
  return await Inventory.findOneAndUpdate(
    { product: productId, stock: { $gte: quantity } },
    { $inc: { stock: -quantity, reserved: quantity } },
    { new: true }
  );
};

const sold = async (productId, quantity) => {
  const inventory = await Inventory.findOne({ product: productId });
  if (inventory.reserved < quantity) {
    throw new Error('Not enough reserved items to be sold');
  }
  return await Inventory.findOneAndUpdate(
    { product: productId, reserved: { $gte: quantity } },
    { $inc: { reserved: -quantity, soldCount: quantity } },
    { new: true }
  );
};

module.exports = {
  updateStock,
  reservation,
  sold,
};
