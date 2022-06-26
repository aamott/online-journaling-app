/************************
 * Entry point for the app
 */
var express = require('express');
var mongodb = require('./db/connect');
var bodyParser = require('body-parser');
var cors = require('cors');
var _a = require('express-openid-connect'),
  auth = _a.auth,
  requiresAuth = _a.requiresAuth;
/********
 * Config
 */
var app = express();
var port = process.env.PORT || 8080;
var config = {
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
/********
 * Connect database and start server
 */
mongodb.initDb(function (err, mongodb) {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log('Connected to DB and listening on '.concat(port));
  }
});
