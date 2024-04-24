import type { NextApiRequest, NextApiResponse } from 'next';

import { verify } from '@/lib/paymentProvider';
import { db } from '@/server/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { paymentId } = req.body;
  const payment = await db
    .selectFrom('Payment')
    .selectAll()
    .where('Payment.id', '=', paymentId)
    .executeTakeFirstOrThrow();

  const invoiceRes = await verify({
    invoiceId: payment.invoiceId as string,
  });

  if (invoiceRes.code === 'success') {
    const data = db
      .updateTable('Payment')
      .where('id', '=', paymentId)
      .set({
        status: 'PAID',
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return res.status(200).json({ code: 'PAID', data: data });
  } else {
    db.updateTable('Payment')
      .where('id', '=', paymentId)
      .set({
        status: 'UNPAID',
      })
      .executeTakeFirstOrThrow();
    return res.status(200).json({ code: 'UNPAID' });
  }
}
