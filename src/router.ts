import { Router } from 'express'

import { googleRouter } from '@/modules/google/google.routes'

export const router = Router()

router.use('/connect/google', googleRouter)
