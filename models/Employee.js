const { Schema, model } = require('mongoose');

const employeeSchema = new Schema(
  {
    employeeID: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    salary: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
    collection: 'employees',
  }
);

module.exports = model('Employee', employeeSchema);


