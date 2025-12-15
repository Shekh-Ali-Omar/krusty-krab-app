const { Schema, model } = require('mongoose');

const krustyKrabSchema = new Schema(
  {
    _id: { type: Number, required: true },
    location: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    openingHours: { type: String, required: true, trim: true },
  },
  {
    collection: 'krusty_krab',
  }
);

module.exports = model('KrustyKrab', krustyKrabSchema);


