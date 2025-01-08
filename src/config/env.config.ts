export const EnvConfiguration = () => ({
    //DATA TO CONNECT
    MONGO_URI: process.env.MONGO_URI,

    //DATA TO APP SECURITY
    SSL_KEY_PATH: process.env.SSL_KEY_PATH,
    SSL_CERT_PATH: process.env.SSL_CERT_PATH,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    ALLOWED_HEADERS: process.env.ALLOWED_HEADERS,
    API_PORT: process.env.API_PORT,
    SECURE_DEPLOYMENT: process.env.SECURE_DEPLOYMENT || false,

    //SWAGGER CONFIGURATION
    SWAGGER_TITLE: process.env.SWAGGER_TITLE,
    SWAGGER_DESCRIPTION: process.env.SWAGGER_DESCRIPTION,
    SWAGGER_VERSION: process.env.SWAGGER_VERSION,
    SWAGGER_PATH: process.env.SWAGGER_PATH,

    //DATA TO LOGS
    LOG_FILE_PATH: process.env.LOG_FILE_PATH,
    CREATE_LOG_FILE: process.env.CREATE_LOG_FILE || false,
    PRINT_TO_CONSOLE: process.env.PRINT_TO_CONSOLE || false,

    //OTHERS
    ISMIGRATION: process.env.ISMIGRATION || false,
});