import { createServerSideHelpers } from '@trpc/react-query/server';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import superjson from 'superjson';

import PublicLayout from '@/components/layout/public-layout';
import { EventList } from '@/components/list/event-list';
import { getServerAuthSession } from '@/lib/auth';
import type { Event } from '@/lib/types';
import { appRouter } from '@/server/api/root';
import { db } from '@/server/db';
import { api } from '@/utils/api';
import { Container, LoadingOverlay, Space } from '@mantine/core';
import { FeaturedEventDetail } from '@/components/event/featured-detail';
import { EventDetail } from '@/components/event/detail';

export default function EventViewPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { slug } = props;
  const { data: event, isLoading } = api.event.findBySlug.useQuery({
    slug: slug as string,
  });
  const { data: relatedEvents, isLoading: isRelatedLoading } =
    api.event.findRelated.useQuery({
      excludeId: event?.id as unknown as string,
      limit: 6,
    });

  if (isLoading) {
    return <LoadingOverlay />;
  }
  // const { mutate } = api.eventUser.sendRequest.useMutation({
  //   onSuccess: newReq => console.log(newReq),
  // });
  // function handleSendRequest() {
  //   mutate({ eventId: data?.id as unknown as string, role: 'mopper' });
  // }
  return (
    <PublicLayout>
      {event?.featured == true ? (
        <FeaturedEventDetail event={event as Event} />
      ) : (
        <EventDetail event={event as Event} />
      )}
      <Container size={'xl'}>
        <Space h="lg" />
        <EventList
          events={relatedEvents as unknown as Event[]}
          isLoading={isRelatedLoading}
        />
      </Container>
    </PublicLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getServerAuthSession(context);

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      db: db,
      userId: session?.user.id ? session.user.id : undefined,
      userType: session?.user.userType ? session?.user.userType : undefined,
      role: session?.user.role,
    },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if (typeof slug !== 'string') throw new Error('no id');

  await helpers.event.findBySlug.prefetch({ slug: slug });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      slug,
    },
  };
};
