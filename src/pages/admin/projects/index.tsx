import { useState } from 'react';

import { ProjectsTable } from '@/components/admin/table/projects-table';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { ProjectStatus, ProjectType } from '@/lib/db/enums';
import type { Project } from '@/lib/types';
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
    (type as string) ?? ProjectType.FUNDRAISING
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

  const { data: projectsData, isLoading } = api.project.findAll.useQuery({
    page: activePage,
    limit: 10,
    type: type as ProjectType,
    title: q as string,
    status: status as ProjectStatus,
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
            data={[ProjectType.FUNDRAISING, ProjectType.GRANT_FUNDRAISING]}
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
          {projectsData && projectsData?.items.length > 0 ? (
            <ProjectsTable data={projectsData?.items as unknown as Project[]} />
          ) : (
            <Alert>No projects to show</Alert>
          )}
        </div>
        <Center mt={10}>
          <Pagination
            total={projectsData ? projectsData?.pagination.totalPages : 1}
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
