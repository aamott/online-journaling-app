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
// callback after successful login
router.use('/loginCallback', users.loginCallback);
// Get the active user
router.get('/active', (0, express_openid_connect_1.requiresAuth)(), users.getActiveUser);
// Get all users
// router.get('/', requiresAuth(), users.getAllUsers);
// Get a specific user
// router.get('/:id', requiresAuth(), users.getUser);
// Add a new user
// router.post('/', requiresAuth(), users.addUser);
// Update a user
// router.put('/:id', requiresAuth(), users.updateUser);
// Delete a user
// router.delete('/:id', requiresAuth(), users.deleteUser);
module.exports = router;
