"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**********************
 * Main Route
 */
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const mongodb = require('../db/connect');
/********************
 * MongoDB
 */
router.use((req, res, next) => {
    res.locals = {};
    res.locals.mongodb = mongodb;
    next();
});
/********************
 * Routes
 */
// Users routes
router.use('/users', require('./users') /* #swagger.tags = ['Users'] */);
// Entries routes
router.use('/entries', require('./entries') /* #swagger.tags = ['Entries'] */);
//Goals routes
router.use('/goals', require('./goals') /* #swagger.tags = ['Goals'] */);
// Media routes
router.use('/media', require('./media') /* #swagger.tags = ['Media'] */);
// swagger routes
const swaggerDocument = __importStar(require("../swagger.json"));
const swaggerUi = require('swagger-ui-express');
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));
// Authorization routes
// > Authorization - TODO: move to a separate file
router.get('/authorized', function (_req, res) {
    res.send('Secured Resource');
});
// > Sign up
router.get('/sign-up', (_req, res) => {
    res.oidc.login({
        authorizationParams: {
            screen_hint: 'signup',
        },
    });
});
/************
 * Export
 */
module.exports = router;
