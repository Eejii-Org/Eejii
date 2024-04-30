import { PaymentStatus, PermitType } from '@/lib/db/enums';
import { db } from '@/server/db';
import { TRPCError } from '@trpc/server';

async function handlePermit(permitId: string, userId: string) {
  const permit = await db
    .selectFrom('Permit')
    .selectAll()
    .where('id', '=', permitId)
    .executeTakeFirstOrThrow();
  if (permit.type === PermitType.EVENT) {
    await db
      .updateTable('User')
      .where('id', '=', userId)
      .set(eb => ({
        eventPermit: eb('eventPermit', '+', permit.quantity),
      }))
      .executeTakeFirstOrThrow();
  } else if (permit.type === PermitType.PROJECT) {
    await db
      .updateTable('User')
      .where('id', '=', userId)
      .set(eb => ({
        projectPermit: eb('projectPermit', '+', permit.quantity),
      }))
      .executeTakeFirstOrThrow();
  } else if (permit.type === PermitType.BANNER) {
    const banner = await db
      .insertInto('Banner')
      .values({
        bannerPositionId: permit.bannerPositionId,
      })
      .returning('id')
      .executeTakeFirstOrThrow();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + permit.quantity);
    await db
      .insertInto('PartnerBanner')
      .values({
        bannerId: banner.id,
        userId: userId,
        active: true,
        startDate: new Date(),
        endDate: endDate,
      })
      .executeTakeFirstOrThrow();
  } else if (permit.type === PermitType.SUBSCRIPTION) {
    const user = await db
      .selectFrom('User')
      .select([
        'subscriptionEndsAt',
        'subscriptionId',
        'mediaPermit',
        'eventPermit',
        'projectPermit',
      ])
      .where('id', '=', userId)
      .executeTakeFirstOrThrow();
    const prevSubscription = await db
      .selectFrom('Subscription')
      .select(['id', 'maxMedia', 'maxEvents', 'maxProjects'])
      .where('id', '=', user.subscriptionId)
      .executeTakeFirst();
    let eventPermit = user.eventPermit;
    let projectPermit = user.projectPermit;
    let mediaPermit = user.mediaPermit;
    if (user.subscriptionId !== permit.subscriptionId) {
      eventPermit = prevSubscription?.maxEvents as number;
      mediaPermit = prevSubscription?.maxMedia as number;
      projectPermit = prevSubscription?.maxProjects as number;
    }
    let date;
    if (user.subscriptionEndsAt) {
      date = new Date(user.subscriptionEndsAt);
    }
    const currentMonth = date?.getMonth();
    await db
      .updateTable('User')
      .where('id', '=', userId)
      .set({
        subscriptionId: permit.subscriptionId,
        subscriptionEndsAt: new Date(
          currentMonth ?? new Date().getMonth() + permit.quantity
        ),
        mediaPermit: mediaPermit,
        eventPermit: eventPermit,
        projectPermit: projectPermit,
      })
      .executeTakeFirstOrThrow();
  }
}

async function handleDonation(donationId: string) {
  await db
    .updateTable('Donation')
    .where('id', '=', donationId)
    .set({
      status: PaymentStatus.PAID,
    })
    .executeTakeFirstOrThrow();
}

export default async function handlePaymentSuccess(
  paymentId: string,
  userId: string
) {
  const payment = await db
    .selectFrom('Payment')
    .selectAll()
    .where('id', '=', paymentId)
    .executeTakeFirst();
  if (!payment) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Payment not found' });
  }

  if (payment.permitId) {
    handlePermit(payment.permitId, userId);
  } else if (payment.donationId) {
    handleDonation(payment.donationId);
  }
}
