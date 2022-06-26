const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Online Journal',
    description: 'A web app for journaling'
  },
  // host: 'https://online-journey.herokuapp.com/',
  host: "http://localhost:8080/",
  // schemes: ['https']
  schemes: ['http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./app.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);
