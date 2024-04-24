import { EventList } from '@/components/list/event-list';
import { EventType } from '@/lib/db/enums';
import type { Event } from '@/lib/types';
import { api } from '@/utils/api';
import { Center, Pagination, SegmentedControl, Stack } from '@mantine/core';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const StandartPartnersEventList = ({
  partnerId,
}: {
  partnerId: string;
}) => {
  const router = useRouter();
  const { eventType, eventPage } = router.query;
  const [activePage, setActivePage] = useState(eventPage ? +eventPage : 1);
  const { data: events, isLoading } = api.event.findAll.useQuery({
    partnerId: partnerId,
    type: (eventType as EventType) ?? EventType.EVENT,
    limit: 3,
    page: activePage,
  });
  console.log(events);
  return (
    <Stack gap={'xl'}>
      <div className="w-[283px]  m-auto">
        <h5 className="text-2xl pt-12 pb-2 text-center uppercase font-semibold border-b-4 border-primary">
          Төсөл хөтөлбөрүүд
        </h5>
      </div>
      <SegmentedControl
        radius={'md'}
        color="primary"
        data={[
          { label: 'Арга хэмжээ', value: EventType.EVENT },
          { label: 'Сайн дурын ажил', value: EventType.VOLUNTEERING },
        ]}
        onChange={value => {
          router.push(
            {
              pathname: router.pathname,
              query: { ...router.query, eventType: value },
            },
            {},
            { shallow: true }
          );
        }}
        fullWidth
      />
      <EventList
        events={events?.items as unknown as Event[]}
        isLoading={isLoading}
      />
      <Center>
        <Pagination
          total={
            events?.pagination?.totalPages ? +events?.pagination?.totalPages : 0
          }
          radius="xl"
          value={activePage}
          onChange={value => {
            setActivePage(value);
            router.push({
              pathname: router.pathname,
              query: { ...router.query, eventPage: value },
            });
          }}
        />
      </Center>
    </Stack>
  );
};
