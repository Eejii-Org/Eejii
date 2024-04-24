import type { NextApiRequest, NextApiResponse } from 'next';

import { generate } from '@/lib/paymentProvider';
import { db } from '@/server/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, projectId, amount } = req.body;
  const response = await db.transaction().execute(async trx => {
    const donation = await trx
      .insertInto('Donation')
      .values({
        amount: amount,
        userId: userId,
        isPublicName: true,
        projectId: projectId,
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    const invoice = await generate({
      invoiceNo: donation.id,
      amount: amount,
      expireAt: undefined,
    });

    const payment = await trx
      .insertInto('Payment')
      .values({
        amount: amount,
        status: 'AWAITING_PAYMENT',
        donationId: donation.id,
        invoiceId: invoice.invoice_id,
        details: invoice,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return payment;
  });

  return res.status(200).json(response);
}
