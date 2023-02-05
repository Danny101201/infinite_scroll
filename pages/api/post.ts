import { prisma } from './../../server/db';

import type { NextApiRequest, NextApiResponse } from 'next'
import { post } from '@prisma/client';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const limit = 5
    const cusor = req.query.cusor ?? ''
    const cusorObj = cusor === '' ? undefined : { id: parseInt(cusor as string) }
    const posts = await prisma.post.findMany({
      take: limit,
      cursor: cusorObj,
      skip: cusor === '' ? 0 : 1
    })

    res.status(200).json({ posts, nextId: posts.length === limit ? posts[limit - 1]?.id : undefined })
  }

}
