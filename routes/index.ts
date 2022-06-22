import express from 'express';
import * as swaggerDocument from '../swagger.json';
/**********************
 * Main Route
 */
const router = express.Router();


/********************
 * Routes
 */
// TODO: Update this to the routes we really have
// Recipes routes
// router.use('/recipes', require('./recipes'));


// swagger routes
const swaggerUi = require('swagger-ui-express');

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));


/************
 * Export
 */
module.exports = router;
