/**********************
 * Main Route
 */
import express from 'express';
const router = express.Router();

/********************
 * Routes
 */
// Users routes
router.use('/users', require('./users'));

// swagger routes
import * as swaggerDocument from '../swagger.json';
const swaggerUi = require('swagger-ui-express');

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

/************
 * Export
 */
module.exports = router;
