import dotenv from 'dotenv'
import { EngineReportingOptions } from 'apollo-engine-reporting'
import { ConnectionOptions } from 'typeorm'
import { Environment } from '@/constants'

type Config = {
  [key in Environment]: {
    frontendBaseUrl: string
    db: ConnectionOptions
    apolloEngine?: EngineReportingOptions<unknown>
  }
}

dotenv.config()

const defaultDbConfig = {
  type: 'postgres' as const,
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'scorekeep-admin',
  password: process.env.DATABASE_PASS ?? "ADAM's COOL",
  database: 'postgres',
  url: process.env.DATABASE_URL,

  logging: false,
  entities: ['src/modules/**/*.model.ts'],
  migrations: ['migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
  cli: {
    entitiesDir: 'src/modules',
    migrationsDir: 'migrations',
    subscribersDir: 'src/subscribers',
  },
}

const _config: Config = {
  [Environment.DEVELOPMENT]: {
    frontendBaseUrl: process.env.FRONTEND_BASE_URL!,
    db: {
      ...defaultDbConfig,
      synchronize: true,
      migrationsRun: true,
    },
  },
  [Environment.TEST]: {
    frontendBaseUrl: 'http://front.end',
    db: {
      ...defaultDbConfig,
      schema: 'scorekeep-tests',
      synchronize: true,
      dropSchema: true,
    },
  },
  [Environment.PRODUCTION]: {
    frontendBaseUrl: process.env.FRONTEND_BASE_URL!,
    db: {
      ...defaultDbConfig,
      url: process.env.DATABASE_URL,
      migrationsRun: true,
    },
    apolloEngine: {
      apiKey: process.env.APOLLO_ENGINE_KEY,
    },
  },
}

export const config =
  // || to replace empty string as well
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  _config[(process.env.NODE_ENV || 'development') as Environment]
