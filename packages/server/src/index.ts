import 'reflect-metadata'

import { connectToDatabase } from '@/db'
import { createApp, connectApolloServer } from '@/apollo'

const port = process.env.PORT || 3000

const start = async () => {
  await connectToDatabase()

  const app = createApp()
  await connectApolloServer(app)

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on ${port}`)
  })
}

start()
