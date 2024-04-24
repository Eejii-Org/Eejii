import PartnerLayout from '@/components/layout/partner-layout';
import { getServerAuthSession } from '@/lib/auth';
import classes from '@/styles/GroupTabs.module.css';
import { appRouter } from '@/server/api/root';
import { db } from '@/server/db';
import { api } from '@/utils/api';
import type { Event } from '@/lib/types';
import {
  Tabs,
  Space,
  ActionIcon,
  Container,
  Flex,
  Paper,
  LoadingOverlay,
  Title,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { createServerSideHelpers } from '@trpc/react-query/server';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import superjson from 'superjson';
import { MyVolunteersTable } from '@/components/partner/event/my-volunteers-table';
import { VolunteerApplicantsTable } from '@/components/partner/event/volunteer-applicants-table';
import { OtherVolunteersTable } from '@/components/partner/event/volunteers-table';

export default function EventVolunteers(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { slug } = props;
  if (!slug) {
    return <LoadingOverlay />;
  }
  const { data, isLoading } = api.event.findBySlug.useQuery({ slug: slug });

  if (data === undefined && isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <PartnerLayout>
      <Container fluid p={'xl'}>
        <Paper withBorder p={20} radius={'md'}>
          <Flex justify={'start'} align={'center'} gap={20}>
            <ActionIcon
              component={Link}
              href={`/p/events/${data?.slug}`}
              radius={'xl'}
              size={'lg'}
              variant="light"
            >
              <IconArrowLeft />
            </ActionIcon>
            <Title order={2}>{data?.title}</Title>
          </Flex>
        </Paper>
        <Space h="md" />
        <Tabs defaultValue="my_volunteers" classNames={classes}>
          <Tabs.List grow>
            <Tabs.Tab value="my_volunteers">My volunteers</Tabs.Tab>
            <Tabs.Tab value="volunteer_applicants">
              Volunteer applicants
            </Tabs.Tab>
            <Tabs.Tab value="other_volunteers">Potential volunteers</Tabs.Tab>
          </Tabs.List>
          <Space h="lg" />
          <Tabs.Panel value="my_volunteers">
            <MyVolunteersTable event={data as Event} />
          </Tabs.Panel>
          <Tabs.Panel value="volunteer_applicants">
            <VolunteerApplicantsTable event={data as Event} />
          </Tabs.Panel>
          <Tabs.Panel value="other_volunteers">
            <OtherVolunteersTable event={data as Event} />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </PartnerLayout>
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
