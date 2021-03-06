/**********************
 * Main Route
 */
import express from 'express';
import { ObjectId } from 'mongodb';
const router = express.Router();
const mongodb = require('../db/connect');


/********************
 * MongoDB
 */
router.use((req: any, res: any, next: any) => {
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
router.use('/entries', require('./entries') /* #swagger.tags = ['Entries'] */ );

//Goals routes
router.use('/goals', require('./goals') /* #swagger.tags = ['Goals'] */ );

// Media routes
router.use('/media', require('./media') /* #swagger.tags = ['Media'] */);

// swagger routes
import * as swaggerDocument from '../swagger.json';
const swaggerUi = require('swagger-ui-express');

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

// Authorization routes
router.get('/authorized', function (_req: any, res: { send: (arg0: string) => void; }) {
    res.send(JSON.stringify('Secured Resource'));
});

// > Sign up
router.get('/sign-up', (_req: any, res: any) => {
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
