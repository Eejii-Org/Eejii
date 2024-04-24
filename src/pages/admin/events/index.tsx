import { useState } from 'react';

import { EventsTable } from '@/components/admin/table/events-table';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { EventType, ProjectStatus } from '@/lib/db/enums';
import type { Event } from '@/lib/types';
import { api } from '@/utils/api';
import {
  ActionIcon,
  Alert,
  Center,
  Group,
  LoadingOverlay,
  Pagination,
  SegmentedControl,
  Stack,
  TextInput,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const Select = dynamic(() => import('@mantine/core').then(el => el.Select), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Index() {
  const router = useRouter();
  const { q, type, page, status } = router.query;

  const [search, setSearch] = useState(q ?? '');
  const [activePage, setPage] = useState(page ? +page : 1);
  const [activeTab, setActiveTab] = useState<string | null>(
    (type as string) ?? EventType.EVENT
  );

  function handleActiveTab(value: string | null) {
    router.push(
      {
        pathname: router.pathname,
        query: { type: value },
      },
      undefined,
      { scroll: false }
    );
    setActiveTab(value);
  }

  const { data: eventsData, isLoading } = api.event.findAll.useQuery({
    page: activePage,
    status: status as string,
    limit: 10,
    type: type as string,
    title: q as string,
  });

  return (
    <DashboardLayout>
      {isLoading && <LoadingOverlay visible />}
      <Stack>
        <Group gap="md" justify="space-between" grow>
          <SegmentedControl
            fullWidth
            miw={400}
            value={activeTab as string}
            onChange={handleActiveTab}
            data={[EventType.EVENT, EventType.VOLUNTEERING]}
          />
          <TextInput
            miw={500}
            placeholder="Search"
            onChange={e => {
              e.preventDefault();
              setSearch(e.currentTarget.value);
            }}
            rightSection={
              <ActionIcon
                variant="transparent"
                onClick={() => {
                  router.push({
                    pathname: router.pathname,
                    query: { ...router.query, q: search },
                  });
                }}
              >
                <IconSearch />
              </ActionIcon>
            }
          />
          <Select
            defaultValue={(status as string) ?? ''}
            placeholder="Status"
            onChange={value => {
              router.push({
                pathname: router.pathname,
                query: { ...router.query, status: value },
              });
            }}
            data={[
              ProjectStatus.APPROVED,
              ProjectStatus.DONE,
              ProjectStatus.DENIED,
              ProjectStatus.PENDING,
            ]}
          />
        </Group>
        <div>
          {eventsData && eventsData?.items.length > 0 ? (
            <EventsTable data={eventsData?.items as unknown as Event[]} />
          ) : (
            <Alert>No events to show</Alert>
          )}
        </div>
        <Center mt={10}>
          <Pagination
            total={eventsData ? eventsData?.pagination.totalPages : 1}
            radius="xl"
            value={activePage}
            onChange={value => {
              setPage(value);
              router.push({
                pathname: router.pathname,
                query: { ...router.query, page: value },
              });
            }}
          />
        </Center>
      </Stack>
    </DashboardLayout>
  );
}
