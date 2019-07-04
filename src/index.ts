import { createServer } from '@/apollo'

const { PORT } = process.env
const port = PORT || 3000

const start = async () => {
  const server = await createServer()

  await server.listen(port)

  console.log(`Listening on ${port}`)
}

start()
