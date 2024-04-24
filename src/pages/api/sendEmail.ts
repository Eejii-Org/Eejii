import sendEmail from '@/lib/mailer';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { to, subject, html } = JSON.parse(req.body);
  sendEmail(to, subject, html);
  res.send(200);
}
