/***************
 * Users routes
 */
import express from 'express';
import { requiresAuth } from 'express-openid-connect';
const router = express.Router();
const users = require('../controllers/users');

// Get all users
router.get('/', users.getAllUsers);

// // Get a specific user
router.get('/:id', users.getUser);

// // Add a new user
router.post('/', requiresAuth(), users.addUser);

// // Update a user
router.put('/:id', requiresAuth(), users.updateUser);

// // Delete a user
router.delete('/:id', requiresAuth(), users.deleteUser);

module.exports = router;
