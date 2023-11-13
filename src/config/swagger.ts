import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerConfig: swaggerJSDoc.OAS3Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Orion API',
      description: 'Documentação da API do projeto Orion.',
      version: '1.0.0'
    },
    host: 'localhost:4444',
    // Não obrigatório, serve apenas para definir a ordem das categorias
    tags: [],
    externalDocs: {
      description: 'View swagger.json',
      url: '../swagger.json'
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          in: 'header',
          type: 'http',
          scheme: 'bearer'
        }
      },
      schemas: {
        WeatherCard: {
          type: 'object',
          properties: {
            temperature: {
              type: 'object',
              properties: {
                celsius: {
                  type: 'object',
                  properties: {
                    min: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number'
                        },
                        variation: {
                          type: 'string',
                          enum: ['higher', 'lower', 'neutral']
                        }
                      }
                    },
                    max: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number'
                        },
                        variation: {
                          type: 'string',
                          enum: ['higher', 'lower', 'neutral']
                        }
                      }
                    }
                  }
                },
                fahrenheit: {
                  type: 'object',
                  properties: {
                    min: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number'
                        },
                        variation: {
                          type: 'string',
                          enum: ['higher', 'lower', 'neutral']
                        }
                      }
                    },
                    max: {
                      type: 'object',
                      properties: {
                        value: {
                          type: 'number'
                        },
                        variation: {
                          type: 'string',
                          enum: ['higher', 'lower', 'neutral']
                        }
                      }
                    }
                  }
                }
              }
            },
            terrestrialDate: {
              type: 'string'
            },
            solDate: {
              type: 'integer',
              format: 'int32'
            }
          }
        },
        WeatherData: {
          type: 'object',
          properties: {
            weatherCards: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/WeatherCard'
              }
            }
          }
        },
        WeatherResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'boolean'
            },
            data: {
              $ref: '#/components/schemas/WeatherData'
            }
          }
        }
      }
    }
  },
  apis: ['src/controller/*.ts', 'controller/*.js']
};
