import { withCors } from './_utils.js'

export default withCors(async function handler(req: any, res: any) {
  res.status(200).json({ ok: true, ts: Date.now() })
})
