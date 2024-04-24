import { EventList } from '@/components/list/event-list';
import { EventType, ProjectStatus } from '@/lib/db/enums';
import { api } from '@/utils/api';
import { Center, Pagination, Space, Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import type { Event } from '@/lib/types';

export const Explore = () => {
  const router = useRouter();
  const { type, page } = router.query;

  const [activePage, setPage] = useState(page ? +page : 1);
  const [activeTab, setActiveTab] = useState<string | null>(
    (type as string) ?? EventType.EVENT
  );
  function handleSetPage(value: number) {
    setPage(value);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: value },
    });
  }

  function handleActiveTab(value: string | null) {
    router.push(
      {
        query: { ...router.query, type: value },
      },
      undefined,
      { scroll: false }
    );
    setActiveTab(value);
  }

  const { data: events, isLoading } = api.event.findAll.useQuery({
    page: activePage,
    limit: 10,
    enabled: true,
    status: ProjectStatus.APPROVED,
    type: type as EventType,
  });

  const totalPages = events?.pagination.totalPages;
  return (
    <div>
      <Tabs
        className="-translate-y-8"
        value={activeTab}
        onChange={handleActiveTab}
      >
        <Tabs.List>
          <Tabs.Tab value={EventType.EVENT}>Event</Tabs.Tab>
          <Tabs.Tab value={EventType.VOLUNTEERING}>Volunteering event</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <EventList events={events?.items as Event[]} isLoading={isLoading} />
      <Space h={'lg'} />
      <Center>
        <Pagination
          radius="xl"
          value={activePage}
          onChange={handleSetPage}
          total={totalPages ?? 1}
        />
      </Center>
    </div>
  );
};
