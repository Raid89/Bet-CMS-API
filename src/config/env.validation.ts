import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  //DATA TO CONNECT
  MONGO_URI: Joi.string().required().error(new Error('MONGO_URI is required and must be a STRING')), // MONGO_URI is used to specify the URI of the MongoDB database

  //DATA TO APP SECURITY
  SSL_KEY_PATH: Joi.string().required().error(new Error('SSL_KEY_PATH is required and must be a STRING')), // SSL_KEY_PATH is used to specify the path to the SSL key
  SSL_CERT_PATH: Joi.string().required().error(new Error('SSL_KEY_PATH is required and must be a STRING')), // SSL_CERT_PATH is used to specify the path to the SSL certificate
  ALLOWED_ORIGINS: Joi.string().default('*'), // ALLOWED_ORIGINS is used to specify the allowed origins
  ALLOWED_HEADERS: Joi.string().default('*'), // ALLOWED_HEADERS is used to specify the allowed headers
  API_PORT: Joi.number().default(9000), // API_PORT is used to specify the port number on which the server will run
  SECURE_DEPLOYMENT: Joi.boolean().default(false), // SECURE_DEPLOYMENT is used to specify if the deployment is secure

  //SWAGGER CONFIGURATION
  SWAGGER_TITLE: Joi.string().default('API Documentation'), // SWAGGER_TITLE is used to specify the title of the Swagger documentation
  SWAGGER_DESCRIPTION: Joi.string().default('API Documentation'), // SWAGGER_DESCRIPTION is used to specify the description of the Swagger documentation
  SWAGGER_VERSION: Joi.string().default('1.0'), // SWAGGER_VERSION is used to specify the version of the Swagger documentation
  SWAGGER_PATH: Joi.string().default('documentatios'), // SWAGGER_PATH is used to specify the path of the Swagger documentation

  //DATA TO LOGS
  LOG_FILE_PATH: Joi.string().default('./public/logs'), // LOG_FILE_PATH is used to specify the path of the log file
  CREATE_LOG_FILE: Joi.boolean().default(true), // CREATE_LOG_FILE is used to specify if the log file should be created
  PRINT_TO_CONSOLE: Joi.boolean().default(true), // PRINT_TO_CONSOLE is used to specify if the logs should be printed to the console

  //OTHERS
  ISMIGRATION: Joi.boolean().default(false), // ISMIGRATION is used to specify if the migration is enabled
  IMAGE_HOST: Joi.string().required().error(new Error('IMAGEHOST is required and must be a STRING')), // IMAGEHOST is used to specify the host of the images
});