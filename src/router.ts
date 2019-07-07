import { Router } from 'express'

export const router = Router()

router.get('/test', (_, res) => {
  res.send('Hello world!')
})
