

const swaggerJsdoc = require('swagger-jsdoc');

// Swagger configuration
const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Node.js Web API',
        version: '1.0.0',
        description: 'A RESTful API built with Express and MongoDB',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3000}`,
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    apis: ['./src/api/routes/*.js'], // Swagger'ın API rotalarını taraması için doğru yol
  };


const specs = swaggerJsdoc(swaggerOptions);

module.exports=specs;
