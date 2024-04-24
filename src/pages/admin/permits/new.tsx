import DashboardLayout from '@/components/layout/dashboard-layout';
import { api } from '@/utils/api';
import { ActionIcon, Group, Paper, Space, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { PermitForm } from '@/components/admin/form/permit-form';

export default function New() {
  const router = useRouter();

  const { mutate, isLoading: isPending } = api.permit.createPermit.useMutation({
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
        message: 'Successfully created permit',
        color: 'green',
      });
      router.push('/admin/permits');
    },
  });

  return (
    <DashboardLayout>
      <Paper bg={'white'} shadow="sm" p={'md'}>
        <Group justify="start" gap={'lg'}>
          <ActionIcon variant="outline" radius={'lg'} size={'lg'}>
            <IconArrowLeft />
          </ActionIcon>
          <Title order={3}>Create new Permit</Title>
        </Group>
      </Paper>
      <Space h={'lg'} />
      <PermitForm handleSubmit={mutate} isPending={isPending} />
    </DashboardLayout>
  );
}
