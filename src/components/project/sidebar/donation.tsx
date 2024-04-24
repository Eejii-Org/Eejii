import { api } from '@/utils/api';
import {
  Text,
  Avatar,
  Flex,
  Paper,
  SegmentedControl,
  Skeleton,
  Stack,
  Alert,
  Group,
} from '@mantine/core';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export const DonationsInfo = ({ projectId }: { projectId: string }) => {
  const [activeTab, setActiveTab] = useState<string>('Popular');
  const {
    data: donations,
    isLoading,
    refetch,
  } = api.project.getProjectDonations.useQuery({
    id: projectId as string,
    limit: 6,
    sortBy: activeTab === 'Popular' ? 'amount' : 'date',
    sort: 'desc',
  });

  useEffect(() => {
    refetch();
  }, [activeTab]);

  if (isLoading) {
    return (
      <Stack>
        <Skeleton w={'100%'} h={40} />
        <Skeleton w={'100%'} h={40} />
        <Skeleton w={'100%'} h={40} />
        <Skeleton w={'100%'} h={40} />
      </Stack>
    );
  }
  return (
    <Paper withBorder py={15} px={20} radius={'lg'}>
      <SegmentedControl
        defaultValue="Popular"
        value={activeTab}
        onChange={setActiveTab}
        data={['Popular', 'Recent']}
        radius={'lg'}
        fullWidth
      />
      {donations ? (
        <Stack mt={20}>
          {donations?.map(d => (
            <Flex
              justify={'space-between'}
              align={'center'}
              key={d.id as string}
            >
              <Group>
                <Avatar />
                <Flex direction={'column'}>
                  <Text fw={600} size="xs">
                    {d.User?.email}
                  </Text>
                  <Text size="xs">Хандивласан- {d.amount}</Text>
                </Flex>
              </Group>
              <Text size="xs">{format(d?.createdAt, 'MMM do yyyy')}</Text>
            </Flex>
          ))}
        </Stack>
      ) : (
        <div>
          <Alert>No donations</Alert>
        </div>
      )}
    </Paper>
  );
};
