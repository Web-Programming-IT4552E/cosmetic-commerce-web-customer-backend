export interface ConfigInterface {
  NODE_ENV: string;

  PORT: string;

  MONGODB_CONN_STRING: string;

  SWAGGER_ENABLED: string;

  SWAGGER_ENDPOINT: string;
  SWAGGER_TITLE: string;
  SWAGGER_DESCRIPTION: string;
  SWAGGER_SET_VERSION: string;
  SWAGGER_TARGET_SERVER_URL: string;

  REDIS_HOST: string;
  REDIS_PORT: string;

  EMAIL_PORT: string;
  EMAIL_HOST: string;
  EMAIL_ADDRESS: string;
  EMAIL_PASSWORD: string;
}
