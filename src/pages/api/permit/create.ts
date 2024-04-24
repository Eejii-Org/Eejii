import type { NextApiRequest, NextApiResponse } from 'next';

import { generate } from '@/lib/paymentProvider';
import { db } from '@/server/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, permitId } = req.body;
  const permit = await db
    .selectFrom('Permit')
    .selectAll()
    .where('id', '=', permitId)
    .executeTakeFirstOrThrow();
  const response = await db.transaction().execute(async trx => {
    const invoice = await generate({
      invoiceNo: permit.id,
      amount: permit.price / 100,
      expireAt: undefined,
    });
    console.log(invoice);

    const payment = await trx
      .insertInto('Payment')
      .values({
        userId: userId,
        amount: permit.price / 100,
        status: 'AWAITING_PAYMENT',
        permitId: permit.id,
        invoiceId: invoice.invoice_id,
        details: invoice,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return payment;
  });

  return res.status(200).json(response);
}
