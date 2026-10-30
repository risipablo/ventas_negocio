import dotenv from 'dotenv'

dotenv.config()

interface EnvConfig{
    PORT: number;
    NODE_ENV: 'development' | 'production' | 'test';
    MONGODB: string;
    JWT_SECRET: string;
}

const getEnvVar = (key: string, required: boolean = true): string => {
  const value = process.env[key];

  if (!value && required) {
    throw new Error(`Variable de entorno requerida no encontrada: ${key}`);
  }

  return value || '';
};

export const env:EnvConfig = {
    PORT: parseInt(getEnvVar('PORT', false) || '3001', 10),
    NODE_ENV: (getEnvVar('NODE_ENV', false) || 'development') as EnvConfig['NODE_ENV'],
    MONGODB: getEnvVar('MONGODB'),
    JWT_SECRET: getEnvVar('JWT_SECRET')
}