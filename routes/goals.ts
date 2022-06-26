/***************
 * Goals routes
 */
 import express from 'express';
 import { requiresAuth } from 'express-openid-connect';
 const router = express.Router();
 const goals = require('../controllers/goals');
 
 // Get all goals
 router.get('/', goals.getAllGoals);
 
 // Get a specific goal
 router.get('/:id', goals.getGoal);
 
 // Add a new goal
 router.post('/', requiresAuth(), goals.addGoal);
 
 // Update a goal
 router.put('/:id', requiresAuth(), goals.updateGoal);
 
 // Delete a goal
 router.delete('/:id', requiresAuth(), goals.deleteGoal);
 
 module.exports = router;
 