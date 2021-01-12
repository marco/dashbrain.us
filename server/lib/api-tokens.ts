import { NextApiRequest } from 'next';

export function getTokenFromRequest(req: NextApiRequest): string | undefined {
  if (!req.headers?.authorization) {
    return undefined;
  }

  if (!req.headers.authorization.startsWith('Bearer ')) {
    return undefined;
  }

  return req.headers.authorization.substr('Bearer '.length);
}
