"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/***************
 * Goals routes
 */
const express_1 = __importDefault(require("express"));
const express_openid_connect_1 = require("express-openid-connect");
const router = express_1.default.Router();
const goals = require('../controllers/goals');
// Get all goals
router.get('/', goals.getAllGoals);
// Get a specific goal
router.get('/:id', goals.getGoal);
// Add a new goal
router.post('/', (0, express_openid_connect_1.requiresAuth)(), goals.addGoal);
// Update a goal
router.put('/:id', (0, express_openid_connect_1.requiresAuth)(), goals.updateGoal);
// Delete a goal
router.delete('/:id', (0, express_openid_connect_1.requiresAuth)(), goals.deleteGoal);
module.exports = router;
