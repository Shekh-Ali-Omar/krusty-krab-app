const express = require('express');
const KrustyKrab = require('../models/KrustyKrab');

const router = express.Router();

// Create Krusty Krab document
router.post('/', async (req, res) => {
  try {
    const doc = await KrustyKrab.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to create Krusty Krab info', error: err.message });
  }
});

// Get all (usually just one) Krusty Krab documents
router.get('/', async (req, res) => {
  try {
    const docs = await KrustyKrab.find();
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch Krusty Krab info', error: err.message });
  }
});

// Get by _id
router.get('/:id', async (req, res) => {
  try {
    const doc = await KrustyKrab.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Krusty Krab info not found' });
    }
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid id', error: err.message });
  }
});

// Update by _id
router.patch('/:id', async (req, res) => {
  try {
    const doc = await KrustyKrab.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return res.status(404).json({ message: 'Krusty Krab info not found' });
    }
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to update Krusty Krab info', error: err.message });
  }
});

// Delete by _id
router.delete('/:id', async (req, res) => {
  try {
    const doc = await KrustyKrab.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Krusty Krab info not found' });
    }
    res.json({ message: 'Krusty Krab info deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to delete Krusty Krab info', error: err.message });
  }
});

module.exports = router;


