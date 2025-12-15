const express = require('express');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// Create order (with basic referential validation)
router.post('/', async (req, res) => {
  try {
    const { orderID, customerID, menuItemIDs, quantity, date } = req.body;

    if (!orderID || !customerID || !Array.isArray(menuItemIDs) || !Array.isArray(quantity)) {
      return res.status(400).json({ message: 'orderID, customerID, menuItemIDs, and quantity are required' });
    }

    if (menuItemIDs.length !== quantity.length) {
      return res
        .status(400)
        .json({ message: 'menuItemIDs and quantity arrays must have the same length' });
    }

    const customer = await Customer.findOne({ customerID });
    if (!customer) {
      return res.status(400).json({ message: `Customer with customerID ${customerID} does not exist` });
    }

    const menuItems = await MenuItem.find({ name: { $in: menuItemIDs } });
    const foundNames = menuItems.map((m) => m.name);
    const missingNames = menuItemIDs.filter((name) => !foundNames.includes(name));
    if (missingNames.length > 0) {
      return res.status(400).json({
        message: 'Some menu items do not exist',
        missingMenuItems: missingNames,
      });
    }

    // compute totalPrice from menu items and quantities
    const priceMap = {};
    menuItems.forEach((m) => {
      priceMap[m.name] = m.price;
    });
    const totalPrice = menuItemIDs.reduce(
      (sum, name, idx) => sum + (priceMap[name] || 0) * quantity[idx],
      0
    );

    const order = await Order.create({
      orderID,
      customerID,
      menuItemIDs,
      quantity,
      totalPrice,
      date,
    });
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to create order', error: err.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

// Get order by MongoDB _id
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid order id', error: err.message });
  }
});

// Update order (with referential validation if related fields change)
router.patch('/:id', async (req, res) => {
  try {
    const existing = await Order.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const updates = req.body;
    const newCustomerID = updates.customerID ?? existing.customerID;
    const newMenuItemIDs = updates.menuItemIDs ?? existing.menuItemIDs;
    const newQuantity = updates.quantity ?? existing.quantity;

    if (!Array.isArray(newMenuItemIDs) || !Array.isArray(newQuantity)) {
      return res
        .status(400)
        .json({ message: 'menuItemIDs and quantity must both be arrays' });
    }

    if (newMenuItemIDs.length !== newQuantity.length) {
      return res
        .status(400)
        .json({ message: 'menuItemIDs and quantity arrays must have the same length' });
    }

    const customer = await Customer.findOne({ customerID: newCustomerID });
    if (!customer) {
      return res
        .status(400)
        .json({ message: `Customer with customerID ${newCustomerID} does not exist` });
    }

    const menuItems = await MenuItem.find({ name: { $in: newMenuItemIDs } });
    const foundNames = menuItems.map((m) => m.name);
    const missingNames = newMenuItemIDs.filter((name) => !foundNames.includes(name));
    if (missingNames.length > 0) {
      return res.status(400).json({
        message: 'Some menu items do not exist',
        missingMenuItems: missingNames,
      });
    }

    const priceMap = {};
    menuItems.forEach((m) => {
      priceMap[m.name] = m.price;
    });
    const totalPrice = newMenuItemIDs.reduce(
      (sum, name, idx) => sum + (priceMap[name] || 0) * newQuantity[idx],
      0
    );

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        ...updates,
        customerID: newCustomerID,
        menuItemIDs: newMenuItemIDs,
        quantity: newQuantity,
        totalPrice,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to update order', error: err.message });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to delete order', error: err.message });
  }
});

module.exports = router;


