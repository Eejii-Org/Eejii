import { useState } from 'react';

import { PartnerTable } from '@/components/admin/table/partner-table';
import { VolunteerTable } from '@/components/admin/table/volunteer-table';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { RequestStatus, UserType } from '@/lib/db/enums';
import type { User } from '@/lib/types';
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

export const Partners = () => {
  const router = useRouter();
  const { q, page, status } = router.query;

  const [search, setSearch] = useState(q ?? '');
  const [activePage, setPage] = useState(page ? +page : 1);

  const { data: volunteersData, isLoading } = api.partner.findAll.useQuery({
    search: q as string,
    status: status as RequestStatus,
    page: activePage,
    limit: 10,
  });

  return (
    <Stack>
      {isLoading && <LoadingOverlay visible />}
      <Group gap="md" justify="space-between" grow>
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
            RequestStatus.REQUEST_APPROVED,
            RequestStatus.REQUEST_DENIED,
            RequestStatus.REQUEST_PENDING,
          ]}
        />
      </Group>
      <div>
        {volunteersData && volunteersData?.items.length > 0 ? (
          <PartnerTable data={volunteersData?.items as unknown as User[]} />
        ) : (
          <Alert>No projects to show</Alert>
        )}
      </div>
      <Center mt={10}>
        <Pagination
          total={volunteersData ? volunteersData?.pagination.totalPages : 1}
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
  );
};

export const Volunteers = () => {
  const router = useRouter();
  const { q, page, status } = router.query;

  const [search, setSearch] = useState(q ?? '');
  const [activePage, setPage] = useState(page ? +page : 1);

  const { data: volunteersData, isLoading } = api.volunteer.findAll.useQuery({
    search: q as string,
    status: status as RequestStatus,
    page: activePage,
    limit: 20,
  });

  return (
    <Stack>
      {isLoading && <LoadingOverlay visible />}
      <Group gap="md" justify="space-between" grow>
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
            RequestStatus.REQUEST_APPROVED,
            RequestStatus.REQUEST_DENIED,
            RequestStatus.REQUEST_PENDING,
          ]}
        />
      </Group>
      <div>
        {volunteersData && volunteersData?.items.length > 0 ? (
          <VolunteerTable data={volunteersData?.items as unknown as User[]} />
        ) : (
          <Alert>No projects to show</Alert>
        )}
      </div>
      <Center mt={10}>
        <Pagination
          total={volunteersData ? volunteersData?.pagination.totalPages : 1}
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
  );
};

export default function Index() {
  const router = useRouter();
  const { type } = router.query;
  const [activeTab, setActiveTab] = useState<string | null>(
    (type as string) ?? UserType.USER_PARTNER
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

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <SegmentedControl
          fullWidth
          miw={400}
          value={activeTab as string}
          onChange={handleActiveTab}
          data={[UserType.USER_PARTNER, UserType.USER_VOLUNTEER]}
        />
        <div>
          {activeTab === UserType.USER_PARTNER ? <Partners /> : <Volunteers />}
        </div>
      </div>
    </DashboardLayout>
  );
}
