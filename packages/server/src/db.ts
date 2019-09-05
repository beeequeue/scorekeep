import { createConnection } from 'typeorm'

import { config } from '@/config'

export const connectToDatabase = () =>
  createConnection({ ...config.db }).then(connection => connection)
