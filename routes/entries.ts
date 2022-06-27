/***************
 * Entries routes
 */
import express from 'express';
import { requiresAuth } from 'express-openid-connect';
const router = express.Router();
const entries = require('../controllers/entries');

// Get all entries
router.get('/', entries.getAllEntries);

// Get a specific entry
router.get('/:id', entries.getEntry);

// Add a new entry
router.post('/', requiresAuth(), entries.addEntry);

// Update a entry
router.put('/:id', requiresAuth(), entries.updateEntry);

// Delete a entry
router.delete('/:id', requiresAuth(), entries.deleteEntry);

module.exports = router;
