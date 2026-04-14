/**
 * Secrets Management Utility
 *
 * This module provides functionality for managing secrets using AWS Secrets Manager
 * or fallback to environment variables for local development.
 *
 * @module utils/secretsManager
 */

const { promisify } = require('util');

const setTimeoutPromise = promisify(setTimeout);

// Mock AWS Secrets Manager client for now (would be replaced with actual AWS SDK in production)
class MockSecretsManager {
  constructor() {
    this.secrets = {};
  }

  /**
   * Get a secret value
   * @param {string} secretName - Name of the secret to retrieve
   * @returns {Promise<Object>} Secret value
   */
  async getSecretValue(secretName) {
    // Simulate network delay for realistic async behavior
    await setTimeoutPromise(10);

    // In a real implementation, this would call AWS Secrets Manager
    // For now, we'll return environment variables or mock values
    const secretValue = process.env[secretName] || this.secrets[secretName];

    if (!secretValue) {
      throw new Error(`Secret ${secretName} not found`);
    }

    try {
      // Try to parse as JSON first (for structured secrets)
      return { SecretString: JSON.stringify(secretValue) };
    } catch (e) {
      // Return as plain string
      return { SecretString: secretValue };
    }
  }

  /**
   * Store a secret value (for testing purposes)
   * @param {string} secretName - Name of the secret
   * @param {string|Object} secretValue - Value of the secret
   */
  setSecret(secretName, secretValue) {
    this.secrets[secretName] = secretValue;
  }
}

// Use mock implementation for now
const secretsManager = new MockSecretsManager();

/**
 * Initialize secrets manager
 */
function initializeSecretsManager() {
  // In a real implementation, this would initialize the AWS Secrets Manager client
  // Secrets Manager initialized
}

/**
 * Get a secret value by name
 * @param {string} secretName - Name of the secret to retrieve
 * @returns {Promise<string|Object>} Secret value
 */
async function getSecret(secretName) {
  const response = await secretsManager.getSecretValue(secretName);
  const secretString = response.SecretString;

  try {
    // Try to parse as JSON (for structured secrets)
    return JSON.parse(secretString);
  } catch (e) {
    // Return as plain string
    return secretString;
  }
}

/**
 * Get database credentials
 * @returns {Promise<Object>} Database credentials
 */
async function getDatabaseCredentials() {
  try {
    // Try to get structured database credentials from secrets manager
    const dbSecret = await getSecret('DATABASE_CREDENTIALS');
    if (typeof dbSecret === 'object' && dbSecret.uri) {
      return dbSecret;
    }
  } catch (e) {
    // Fallback to environment variables
    // Falling back to environment variables for database credentials
  }

  // Return environment variables
  return {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-interview',
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
  };
}

/**
 * Get JWT secrets
 * @returns {Promise<Object>} JWT configuration
 */
async function getJWTSecrets() {
  try {
    // Try to get structured JWT secrets from secrets manager
    const jwtSecret = await getSecret('JWT_SECRETS');
    if (
      typeof jwtSecret === 'object' &&
      jwtSecret.accessTokenSecret &&
      jwtSecret.refreshTokenSecret
    ) {
      return jwtSecret;
    }
  } catch (e) {
    // Fallback to environment variables
    // Falling back to environment variables for JWT secrets
  }

  // Return environment variables
  return {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'default-access-secret',
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'default-refresh-secret',
    accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m',
    refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d',
  };
}

/**
 * Get OpenAI API key
 * @returns {Promise<string>} OpenAI API key
 */
async function getOpenAIApiKey() {
  try {
    return await getSecret('OPENAI_API_KEY');
  } catch (e) {
    // Fallback to environment variable
    // Falling back to environment variable for OpenAI API key
    return process.env.OPENAI_API_KEY;
  }
}

/**
 * Get Redis configuration
 * @returns {Promise<Object>} Redis configuration
 */
async function getRedisConfig() {
  try {
    // Try to get structured Redis config from secrets manager
    const redisConfig = await getSecret('REDIS_CONFIG');
    if (typeof redisConfig === 'object' && redisConfig.host && redisConfig.port) {
      return redisConfig;
    }
  } catch (e) {
    // Fallback to environment variables
    // Falling back to environment variables for Redis configuration
  }

  // Return environment variables
  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB, 10) || 0,
  };
}

module.exports = {
  initializeSecretsManager,
  getSecret,
  getDatabaseCredentials,
  getJWTSecrets,
  getOpenAIApiKey,
  getRedisConfig,
};
