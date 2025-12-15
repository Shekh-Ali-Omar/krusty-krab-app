const { Schema, model } = require('mongoose');

const menuItemSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    ingredients: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
    collection: 'menu_items',
  }
);

module.exports = model('MenuItem', menuItemSchema);


