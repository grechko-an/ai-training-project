/**
 * Environment configuration loader
 * Loads and validates environment variables for different test environments
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

export interface EnvironmentConfig {
  /** Base URL for the web application */
  baseUrl: string;
  /** Base URL for the API */
  apiBaseUrl: string;
  /** API version */
  apiVersion: string;
  /** Authentication token */
  authToken: string;
  /** Admin credentials */
  adminUsername: string;
  adminPassword: string;
  /** Test user credentials */
  testUserUsername: string;
  testUserPassword: string;
  /** Test environment name */
  testEnv: 'local' | 'dev' | 'staging' | 'prod';
  /** Timeout configuration */
  defaultTimeout: number;
  apiTimeout: number;
  /** Test retries */
  testRetries: number;
  /** Parallel workers */
  workers: number;
  /** CI mode flag */
  isCI: boolean;
}

/**
 * Load environment configuration
 * @param env - Environment name (local, dev, staging, prod)
 * @returns EnvironmentConfig object
 */
export function loadEnvironmentConfig(env?: string): EnvironmentConfig {
  const envFile = env ? `.env.${env}` : '.env';
  dotenv.config({ path: path.resolve(process.cwd(), envFile) });

  return {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
    apiVersion: process.env.API_VERSION || 'v1',
    authToken: process.env.AUTH_TOKEN || '',
    adminUsername: process.env.ADMIN_USERNAME || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'password',
    testUserUsername: process.env.TEST_USER_USERNAME || 'testuser',
    testUserPassword: process.env.TEST_USER_PASSWORD || 'testpass',
    testEnv: (process.env.TEST_ENV as EnvironmentConfig['testEnv']) || 'local',
    defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT || '60000', 10),
    apiTimeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
    testRetries: parseInt(process.env.TEST_RETRIES || '0', 10),
    workers: parseInt(process.env.WORKERS || '1', 10),
    isCI: process.env.CI === 'true',
  };
}

/**
 * Get environment-specific configuration
 * This allows different configurations per environment
 */
const environmentConfigs: Record<string, Partial<EnvironmentConfig>> = {
  local: {
    baseUrl: 'http://localhost:3000',
    apiBaseUrl: 'http://localhost:3000/api',
  },
  dev: {
    baseUrl: 'https://dev.example.com',
    apiBaseUrl: 'https://dev.example.com/api',
  },
  staging: {
    baseUrl: 'https://staging.example.com',
    apiBaseUrl: 'https://staging.example.com/api',
  },
  prod: {
    baseUrl: 'https://example.com',
    apiBaseUrl: 'https://example.com/api',
  },
};

/**
 * Get configuration for a specific environment
 * @param env - Environment name
 * @returns Partial environment configuration
 */
export function getEnvironmentConfig(env: keyof typeof environmentConfigs): Partial<EnvironmentConfig> {
  return environmentConfigs[env] || environmentConfigs.local;
}

export default loadEnvironmentConfig;