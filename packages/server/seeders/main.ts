import { connectToDatabase } from '@/db'

const run = async () => {
  const conn = await connectToDatabase()

  await conn.close()
}

run()
