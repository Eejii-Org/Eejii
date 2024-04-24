import { CertificateForm } from '@/components/form/certificate-form';
import PartnerLayout from '@/components/layout/partner-layout';
import { getServerAuthSession } from '@/lib/auth';
import type { CertificateTemplate } from '@/lib/db/types';
import { appRouter } from '@/server/api/root';
import { db } from '@/server/db';
import { api } from '@/utils/api';
import {
  ActionIcon,
  Container,
  Flex,
  LoadingOverlay,
  Paper,
  Space,
  Title,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { createServerSideHelpers } from '@trpc/react-query/server';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import superjson from 'superjson';

export default function CertificateTemplate(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { slug } = props;
  // const router = useRouter();
  // const { slug } = router.query;
  if (!slug) {
    return <LoadingOverlay />;
  }

  const { data: event, isLoading } = api.event.findBySlug.useQuery({
    slug: slug as string,
  });

  if (isLoading) {
    return <LoadingOverlay />;
  }
  const { data: template, isLoading: isCertLoading } =
    api.event.getCertificateTemplate.useQuery({
      eventId: event?.id as unknown as string,
    });

  return (
    <PartnerLayout>
      <Container fluid p={'xl'}>
        <Paper withBorder p={20} radius={'md'}>
          <Flex justify={'start'} align={'center'} gap={20}>
            <ActionIcon
              component={Link}
              href={`/p/events/${event?.slug}`}
              radius={'xl'}
              size={'lg'}
              variant="light"
            >
              <IconArrowLeft />
            </ActionIcon>
            <Title order={2}>{event?.title} event's certificate template</Title>
          </Flex>
        </Paper>
        <Space h={'lg'} />
        <Paper bg={'white'} p="md" withBorder radius={'md'}>
          {!isCertLoading && template && (
            <CertificateForm
              template={template as unknown as CertificateTemplate}
              eventId={event?.id as unknown as string}
            />
          )}
        </Paper>
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
