import sendEmail from '@/lib/mailer/sendEmail';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { to, subject, html } = JSON.parse(req.body);
  const response = await sendEmail(to, subject, html);
  if (response !== true) {
    return res.status(500).json(false);
  }
  return res.send(response);
}
