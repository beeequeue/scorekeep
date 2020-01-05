import 'reflect-metadata'

import { connectToDatabase } from '@/db'
import { createApp, connectApolloServer } from '@/apollo'
import { createSchema } from '@/graphql'

const shouldGenerateSnapshot = process.argv.find(
  str => str.includes('--snapshot') || str.includes('-shot'),
)

if (shouldGenerateSnapshot) {
  createSchema().then(() => {
    // eslint-disable-next-line no-process-exit
    process.exit(0)
  })
} else {
  const port = process.env.PORT ?? 3000

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
}
