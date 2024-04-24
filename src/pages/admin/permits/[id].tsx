import { PermitForm } from '@/components/admin/form/permit-form';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { getServerAuthSession } from '@/lib/auth';
import type { Permit } from '@/lib/db/types';
import { appRouter } from '@/server/api/root';
import { db } from '@/server/db';
import { api } from '@/utils/api';
import superjson from 'superjson';
import {
  ActionIcon,
  Group,
  LoadingOverlay,
  Paper,
  Space,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft } from '@tabler/icons-react';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { createServerSideHelpers } from '@trpc/react-query/server';
import Link from 'next/link';

export default function Edit(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const router = useRouter();
  const { id } = props;
  const { data: permit, isLoading } = api.permit.findById.useQuery(
    { id: id as string },
    { enabled: !!id }
  );
  console.log(permit);

  const { mutate, isLoading: isPending } = api.permit.updatePermit.useMutation({
    onError: err => {
      notifications.show({
        title: 'Error',
        message: err.message,
        color: 'red',
      });
      router.push('/admin/permits');
    },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Successfully updated permit',
        color: 'green',
      });
      router.push('/admin/permits');
    },
  });

  if (isLoading) <LoadingOverlay />;

  return (
    <DashboardLayout>
      <Paper bg={'white'} shadow="sm" p={'md'}>
        <Group justify="start" gap={'lg'}>
          <ActionIcon
            variant="outline"
            radius={'lg'}
            size={'lg'}
            component={Link}
            href="/admin/permits"
          >
            <IconArrowLeft />
          </ActionIcon>
          <Title order={3}>Edit Permit</Title>
        </Group>
      </Paper>
      <Space h={'lg'} />
      {permit && (
        <PermitForm
          handleSubmit={mutate}
          isPending={isPending}
          permit={permit as unknown as Permit}
        />
      )}
    </DashboardLayout>
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

  const id = context.params?.id;

  if (typeof id !== 'string') throw new Error('no id');

  await helpers.permit.findById.prefetch({ id: id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
};
