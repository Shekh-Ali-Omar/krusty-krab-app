const { Schema, model } = require('mongoose');

const customerSchema = new Schema(
  {
    customerID: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    contactInfo: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    collection: 'customers',
  }
);

module.exports = model('Customer', customerSchema);


