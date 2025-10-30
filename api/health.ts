import type { VercelRequest, VercelResponse } from '@vercel/node'
import { withCors } from './_utils'

export default withCors(async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({ ok: true, ts: Date.now() })
})


