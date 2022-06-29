"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/***************
 * Media routes
 */
const express_1 = __importDefault(require("express"));
const express_openid_connect_1 = require("express-openid-connect");
const router = express_1.default.Router();
const media = require('../controllers/media');
// Get all media
router.get('/', media.getAllMedia);
// Get a specific media
router.get('/:id', media.getMedia);
// Add a new media
router.post('/', (0, express_openid_connect_1.requiresAuth)(), media.addMedia);
// Update a media
router.put('/:id', (0, express_openid_connect_1.requiresAuth)(), media.updateMedia);
// Delete a media
router.delete('/:id', (0, express_openid_connect_1.requiresAuth)(), media.deleteMedia);
module.exports = router;
