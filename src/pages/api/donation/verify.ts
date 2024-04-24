import type { NextApiRequest, NextApiResponse } from 'next';

import type { Payment } from '@/lib/db/types';
import { verify } from '@/lib/paymentProvider';
import { db } from '@/server/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { paymentId } = req.body;
  const response = await db
    .selectFrom('Payment')
    .selectAll()
    .where('Payment.id', '=', paymentId)
    .executeTakeFirstOrThrow();
  const payment = response as unknown as Payment;
  const invoiceRes = await verify({
    invoiceId: payment.invoiceId as string,
  });

  if (invoiceRes.code === 'success') {
    db.updateTable('Payment')
      .where('id', '=', paymentId)
      .set({
        status: 'PAID',
      })
      .executeTakeFirstOrThrow();
    return res.status(200).json({ message: 'PAID' });
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
