import { ProjectList } from '@/components/list/project-list';
import { ProjectType } from '@/lib/db/enums';
import type { Project } from '@/lib/types';
import { api } from '@/utils/api';
import { Center, Pagination, SegmentedControl, Stack } from '@mantine/core';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const StandartPartnersProjectList = ({
  partnerId,
}: {
  partnerId: string;
}) => {
  const router = useRouter();
  const { projectType, projectPage } = router.query;
  const [activePage, setActivePage] = useState(projectPage ? +projectPage : 1);
  const { data: projects, isLoading } = api.project.findAll.useQuery({
    partnerId: partnerId,
    type: (projectType as ProjectType) ?? ProjectType.FUNDRAISING,
    limit: 3,
    page: activePage,
  });
  console.log(projects);
  return (
    <Stack gap={'xl'}>
      <div className="m-auto  w-[283px]">
        <h5 className="border-b-4 border-primary pb-2 pt-12 text-center text-2xl font-semibold uppercase">
          Төсөл хөтөлбөрүүд
        </h5>
      </div>
      <SegmentedControl
        radius={'md'}
        color="primary"
        data={[
          { label: 'Хандив өгөх төсөл', value: ProjectType.GRANT_FUNDRAISING },
          { label: 'Хандив олох төсөл', value: ProjectType.FUNDRAISING },
        ]}
        onChange={value => {
          router.push(
            {
              pathname: router.pathname,
              query: { ...router.query, projectType: value },
            },
            {},
            { shallow: true }
          );
        }}
        fullWidth
      />
      <ProjectList
        projects={projects?.items as unknown as Project[]}
        isLoading={isLoading}
      />
      <Center>
        <Pagination
          total={
            projects?.pagination?.totalPages
              ? +projects?.pagination?.totalPages
              : 0
          }
          radius="xl"
          value={activePage}
          onChange={value => {
            setActivePage(value);
            router.push({
              pathname: router.pathname,
              query: { ...router.query, projectPage: value },
            });
          }}
        />
      </Center>
    </Stack>
  );
};
