import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const prisma = new PrismaClient();

    const products = await prisma.product.findMany();

    res.status(200).json(products);
}
