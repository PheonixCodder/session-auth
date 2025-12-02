// src/config/database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities'; // Your entities

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get('NODE_ENV') === 'production';
  const isTest = configService.get('NODE_ENV') === 'test';

  return {
    type: 'postgres',

    // Use DATABASE_URL if available, otherwise fall back to individual vars
    url: configService.get('DATABASE_URL'),

    // Fallback configuration (for local development)
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'postgres'),
    password: configService.get('DB_PASSWORD', 'postgres'),
    database: configService.get('DB_NAME', 'myapp'),

    // Entity configuration
    entities: [User], // Explicit for better tree-shaking
    // OR use autoLoadEntities for dynamic loading:
    // autoLoadEntities: true,

    // ⚠️ CRITICAL PRODUCTION SETTINGS
    synchronize: isTest || configService.get('DB_SYNCHRONIZE') === 'true', // NEVER true in production
    dropSchema: isTest, // ONLY for tests

    // Connection settings
    logging: configService.get('DB_LOGGING', !isProduction),
    maxQueryExecutionTime: 1000, // Log slow queries (>1s)

    // SSL configuration
    ssl: isProduction
      ? {
          rejectUnauthorized: false,
        }
      : false,

    // Connection pooling (CRITICAL for production)
    extra: {
      max: 20, // Maximum connections in pool
      min: 5, // Minimum connections in pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    },

    // Migration configuration
    migrations: isProduction ? ['dist/migrations/*.js'] : [],
    migrationsRun: isProduction, // Auto-run migrations in production
  };
};
