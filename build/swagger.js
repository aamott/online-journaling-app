"use strict";
const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
        title: 'Online Journal',
        description: 'A web app for journaling'
    },
    // host: 'online-journey.herokuapp.com',
    host: "localhost:8080",
    // schemes: ['https'],
    schemes: ['http'],
    securityDefinitions: {
        oAuthSample: {
            type: 'oauth2',
            authorizationUrl: 'https://online-journey.herokuapp.com/login',
            flow: 'implicit',
            scopes: {
                read_data: 'read your data',
                write_data: 'modify data in your account'
            }
        }
    }
};
const outputFile = './swagger.json';
const endpointsFiles = ['./app.ts'];
swaggerAutogen(outputFile, endpointsFiles, doc);
