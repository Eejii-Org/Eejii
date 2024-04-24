import { db } from '@/server/db';

export type NotificationType = {
  title: string;
  body: string | null;
  link: string | null;
  receiverId: string;
  senderId: string;
  type: string;
};

export const sendNotification = ({
  title,
  body,
  link,
  receiverId,
  senderId,
  type,
}: NotificationType) => {
  db.insertInto('Notification')
    .values({
      title,
      link,
      body,
      receiverId,
      senderId,
      status: 'new',
      type,
    })
    .execute();
};
