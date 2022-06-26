"use strict";
/************************
 * Entry point for the app
 */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('./db/connect');
const { auth, requiresAuth } = require('express-openid-connect');
/********
 * Config
 */
const app = express();
const port = process.env.PORT || 8080;
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL
};
app.use(cors()).use(bodyParser.json());
app.use(auth(config));
/************
 * Routes
 */
app.use('/', require('./routes/index'));
// > Authorization - TODO: move to a separate file
app.get('/authorized', function (_req, res) {
    res.send('Secured Resource');
});
// > Sign up
app.get('/sign-up', (_req, res) => {
    res.oidc.login({
        authorizationParams: {
            screen_hint: 'signup',
        },
    });
});
/********
 * Connect database and start server
 */
mongodb.initDb((err, mongodb) => {
    if (err) {
        console.log(err);
    }
    else {
        app.listen(port);
        console.log(`Connected to DB and listening on ${port}`);
    }
});
