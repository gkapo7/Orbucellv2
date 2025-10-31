import { withCors } from './_utils'
import type { NextApiRequest, NextApiResponse } from 'next'

export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ ok: true, ts: Date.now() })
})
})


