export default async function handleSendEmail(
  to: string,
  text: string,
  html: string
) {
  const response = await fetch('/api/sendEmail', {
    method: 'POST',
    body: JSON.stringify({
      to: to,
      subject: text,
      html: html,
    }),
  });
  if (response.status > 299) {
    throw new Error('Error while sending email');
  }
}
