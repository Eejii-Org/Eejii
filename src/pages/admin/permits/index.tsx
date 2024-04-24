import DashboardLayout from '@/components/layout/dashboard-layout';
import { PermitType } from '@/lib/db/enums';
import type { Permit } from '@/lib/db/types';
import { priceFormat } from '@/lib/utils/price';
import { api } from '@/utils/api';
import {
  Flex,
  Paper,
  Text,
  Center,
  Button,
  Group,
  Pagination,
  SegmentedControl,
  SimpleGrid,
  Title,
  LoadingOverlay,
  Stack,
  Badge,
  Box,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconCircleX, IconEdit } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

const PermitCard = ({ permit }: { permit: Permit }) => {
  const context = api.useUtils();
  const { mutate: activate, isLoading: isActivateLoading } =
    api.permit.activate.useMutation({
      onError: err => {
        notifications.show({
          title: 'Error',
          message: err.message,
          color: 'red',
        });
      },
      onSuccess: () => {
        context.permit.findAll.invalidate();
        notifications.show({
          title: 'Success',
          message: 'Successfully activated',
          color: 'green',
        });
      },
    });
  const { mutate: disable, isLoading: isDisableLoading } =
    api.permit.disable.useMutation({
      onError: err => {
        notifications.show({
          title: 'Error',
          message: err.message,
          color: 'red',
        });
      },
      onSuccess: () => {
        context.permit.findAll.invalidate();
        notifications.show({
          title: 'Success',
          message: 'Successfully disabled',
          color: 'green',
        });
      },
    });
  return (
    <Paper bg="white" p="md" shadow="sm">
      <Stack gap={'xs'} pos={'relative'}>
        <Badge
          variant="outline"
          color={permit.enabled ? 'green' : 'red'}
          pos={'absolute'}
          top={0}
          right={0}
        >
          {permit.enabled ? 'Active' : 'Disabled'}
        </Badge>
        <Text size="lg" fw="600">
          {permit.name}
        </Text>
        <Text c="dimmed" size="sm">
          {permit.description}
        </Text>
        <Flex justify={'end'}>
          <Box pos="relative">
            <Text c="primary" fw="500" pt={'sm'} pr="md">
              {priceFormat(permit.price, 'MNT')}
            </Text>
            <Text
              c="dimmed"
              size="xs"
              pos="absolute"
              top="0"
              right={0}
              td="line-through"
            >
              {priceFormat(permit.originalPrice, 'MNT')}
            </Text>
          </Box>
        </Flex>
        <Button.Group w="100%">
          <Button
            fullWidth
            component={Link}
            href={`/admin/permits/${permit.id}`}
            color="yellow"
            variant="light"
            leftSection={<IconEdit />}
          >
            Edit
          </Button>
          {permit.enabled ? (
            <Button
              variant="light"
              fullWidth
              color="red"
              leftSection={<IconCircleX />}
              onClick={() => disable({ id: permit.id as unknown as string })}
              loading={isDisableLoading}
            >
              Disable
            </Button>
          ) : (
            <Button
              variant="light"
              fullWidth
              color="green"
              leftSection={<IconCheck />}
              onClick={() => activate({ id: permit.id as unknown as string })}
              loading={isActivateLoading}
            >
              Activate
            </Button>
          )}
        </Button.Group>
      </Stack>
    </Paper>
  );
};

export default function Index() {
  const [activeTab, setActiveTab] = useState<string | null>(PermitType.EVENT);
  const { data, isLoading } = api.permit.findAll.useQuery({
    type: activeTab,
  });

  return (
    <DashboardLayout>
      <Group justify="space-between" mb={'md'}>
        <Title>Permits</Title>
        <Button component={Link} href={'/admin/permits/new'}>
          Create
        </Button>
      </Group>
      <SegmentedControl
        fullWidth
        miw={400}
        value={activeTab as string}
        onChange={setActiveTab}
        data={[PermitType.EVENT, PermitType.PROJECT, PermitType.BANNER]}
      />
      <SimpleGrid cols={{ base: 2, lg: 3, xl: 3 }} my="md" spacing="md">
        {data &&
          data.items &&
          data.items.length > 0 &&
          data.items.map((permit, i) => (
            <PermitCard key={i} permit={permit as unknown as Permit} />
          ))}
        {isLoading && <LoadingOverlay />}
      </SimpleGrid>
      <Center>
        <Pagination total={(data?.pagination.totalPages as number) ?? 1} />
      </Center>
    </DashboardLayout>
  );
}
