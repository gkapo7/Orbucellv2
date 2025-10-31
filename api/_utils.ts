export function withCors(handler: (req: any, res: any) => void | Promise<void>) {
  return async (req: any, res: any) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }
    return handler(req, res)
  }
}

export function badRequest(res: any, message: string) {
  res.status(400).json({ error: message })
}



