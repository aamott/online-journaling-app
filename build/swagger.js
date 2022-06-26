"use strict";
const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
        title: 'Online Journal',
        description: 'A web app for journaling'
    },
    host: 'localhost:8080',
    schemes: ['https']
};
const outputFile = './swagger.json';
const endpointsFiles = ['./app.ts'];
swaggerAutogen(outputFile, endpointsFiles, doc);
