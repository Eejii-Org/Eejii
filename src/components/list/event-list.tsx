import type { Event } from '@/lib/types';
import { Alert, SimpleGrid, Skeleton } from '@mantine/core';
import EventCardPublic from '../card/event-card';

export const EventList = ({
  events,
  isLoading,
}: {
  events: Event[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
        <Skeleton h={420} w={'100%'} radius={'lg'} />
        <Skeleton h={420} w={'100%'} radius={'lg'} />
        <Skeleton h={420} w={'100%'} radius={'lg'} />
      </SimpleGrid>
    );
  }
  return (
    <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing={'lg'}>
      {events?.length > 0 ? (
        events.map((event, i) => <EventCardPublic key={i} event={event} />)
      ) : (
        <Alert title="No result">No fundraisings to show</Alert>
      )}
    </SimpleGrid>
  );
};
