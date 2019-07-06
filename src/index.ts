import 'reflect-metadata'

import { connectToDatabase } from '@/db'
import { createServer } from '@/apollo'

const { PORT } = process.env
const port = PORT || 3000

const start = async () => {
  await connectToDatabase()
  const server = await createServer()

  await server.listen(port)

  // eslint-disable-next-line no-console
  console.log(`Listening on ${port}`)
}

start()
