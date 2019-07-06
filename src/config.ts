import { Environment } from '@/constants'
import { ConnectionOptions } from 'typeorm'

type Config = {
  [key in Environment]: {
    db: ConnectionOptions
  }
}

const defaultDbConfig = {
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
    db: {
      ...defaultDbConfig,
      type: 'sqlite',
      database: 'sqlite/dev.sqlite3',
      synchronize: true,
    },
  },
  [Environment.TEST]: {
    db: {
      ...defaultDbConfig,
      type: 'sqlite',
      database: 'sqlite/test.sqlite3',
      dropSchema: true,
    },
  },
  [Environment.PRODUCTION]: {
    db: {
      ...defaultDbConfig,
      type: 'postgres',
      database: 'scorekeep',
      url: process.env.DB_URL,
      migrationsRun: true,
    },
  },
}

export const config = _config[process.env.NODE_ENV as Environment]
