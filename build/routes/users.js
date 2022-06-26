"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/***************
 * Users routes
 */
const express_1 = __importDefault(require("express"));
const express_openid_connect_1 = require("express-openid-connect");
const router = express_1.default.Router();
const users = require('../controllers/users');
// Get all users
router.get('/', users.getAllUsers);
// Get a specific user
router.get('/:id', users.getUser);
// Add a new user
router.post('/', (0, express_openid_connect_1.requiresAuth)(), users.addUser);
// Update a user
router.put('/:id', (0, express_openid_connect_1.requiresAuth)(), users.updateUser);
// Delete a user
router.delete('/:id', (0, express_openid_connect_1.requiresAuth)(), users.deleteUser);
module.exports = router;
