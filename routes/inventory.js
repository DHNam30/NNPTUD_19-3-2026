const express = require('express');
const router = express.Router();
const Inventory = require('../schemas/inventory');
const inventoryController = require('../controllers/inventory');

// Get all inventories
router.get('/', async (req, res) => {
  try {
    const inventories = await Inventory.find().populate('product');
    res.status(200).send(inventories);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Get inventory by ID
router.get('/:id', async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id).populate('product');
    if (!inventory) {
      return res.status(404).send({ message: 'Inventory not found' });
    }
    res.status(200).send(inventory);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Add stock
router.post('/add_stock', async (req, res) => {
  try {
    const { product, quantity } = req.body;
    if (!product || !quantity || quantity <= 0) {
      return res.status(400).send({ message: 'Product ID and positive quantity are required' });
    }
    const updatedInventory = await inventoryController.updateStock(product, quantity);
    if (!updatedInventory) return res.status(404).send({ message: 'Inventory for this product not found' });
    res.status(200).send(updatedInventory);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Remove stock
router.post('/remove_stock', async (req, res) => {
  try {
    const { product, quantity } = req.body;
    if (!product || !quantity || quantity <= 0) {
      return res.status(400).send({ message: 'Product ID and positive quantity are required' });
    }
    const inventory = await Inventory.findOne({ product: product });
    if (inventory.stock < quantity) {
        return res.status(400).send({ message: 'Not enough stock to remove' });
    }
    const updatedInventory = await inventoryController.updateStock(product, -quantity);
    if (!updatedInventory) return res.status(404).send({ message: 'Inventory for this product not found' });
    res.status(200).send(updatedInventory);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Reservation
router.post('/reservation', async (req, res) => {
  try {
    const { product, quantity } = req.body;
    if (!product || !quantity || quantity <= 0) {
      return res.status(400).send({ message: 'Product ID and positive quantity are required' });
    }
    const updatedInventory = await inventoryController.reservation(product, quantity);
    if (!updatedInventory) return res.status(400).send({ message: 'Reservation failed. Not enough stock.' });
    res.status(200).send(updatedInventory);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Sold
router.post('/sold', async (req, res) => {
  try {
    const { product, quantity } = req.body;
    if (!product || !quantity || quantity <= 0) {
      return res.status(400).send({ message: 'Product ID and positive quantity are required' });
    }
    const updatedInventory = await inventoryController.sold(product, quantity);
    if (!updatedInventory) return res.status(400).send({ message: 'Sale failed. Not enough reserved items.' });
    res.status(200).send(updatedInventory);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
