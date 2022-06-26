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

// Authorization routes
// > Authorization - TODO: move to a separate file
router.get('/authorized', function (_req: any, res: { send: (arg0: string) => void; }) {
    res.send('Secured Resource');
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
