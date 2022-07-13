/***************
 * Media routes
 */
import express from 'express';
import { requiresAuth } from 'express-openid-connect';
const router = express.Router();
const media = require('../controllers/media');

// Get all media
router.get('/', media.getAllMedia);

// Get a specific media
router.get('/:id', media.getMedia);

// Add a new media
router.post('/', requiresAuth(), media.addMedia);

// Delete a media
router.delete('/:id', requiresAuth(), media.deleteMedia);

module.exports = router;
