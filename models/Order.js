const { Schema, model } = require('mongoose');

const orderSchema = new Schema(
  {
    orderID: { type: Number, required: true, unique: true },
    // Business reference to customer by customerID
    customerID: { type: Number, required: true },
    // Business references to menu items by name
    menuItemIDs: [{ type: String, required: true }],
    quantity: [{ type: Number, required: true, min: 1 }],
    totalPrice: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
    collection: 'orders',
  }
);

module.exports = model('Order', orderSchema);


