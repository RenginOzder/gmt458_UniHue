const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'UniHue API', version: '1.0.0', description: 'Web GIS Final Projesi' },
    servers: [{ url: 'http://localhost:5000' }], // Localde çalışırken burası önemli
  },
  apis: ['./routes/*.js'],
};
module.exports = swaggerJsDoc(swaggerOptions);