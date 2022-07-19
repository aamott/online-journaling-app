"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/***************
 * Entries routes
 */
const express_1 = __importDefault(require("express"));
const express_openid_connect_1 = require("express-openid-connect");
const router = express_1.default.Router();
const entries = require('../controllers/entries');
// Get all entries
router.get('/', (0, express_openid_connect_1.requiresAuth)(), entries.getAllEntries);
// Get a specific entry
router.get('/:id', (0, express_openid_connect_1.requiresAuth)(), entries.getEntry);
// Add a new entry
router.post('/', (0, express_openid_connect_1.requiresAuth)(), entries.addEntry);
// Update a entry
router.put('/:id', (0, express_openid_connect_1.requiresAuth)(), entries.updateEntry);
// Delete a entry
router.delete('/:id', (0, express_openid_connect_1.requiresAuth)(), entries.deleteEntry);
module.exports = router;
