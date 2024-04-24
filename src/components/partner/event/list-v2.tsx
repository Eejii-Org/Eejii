import type { Event } from '@/lib/db/types';
import { SimpleGrid, Skeleton } from '@mantine/core';
import { EventCardV2 } from './card-v2';

export const EventListPrivateV2 = ({
  events,
  isLoading,
}: {
  events: Event[] | undefined;
  isLoading: boolean;
}) => {
  return (
    <>
      {!isLoading ? (
        <SimpleGrid spacing={20}>
          {events && events?.length > 0
            ? events?.map((item, i) => (
                <EventCardV2 key={i} event={item as unknown as Event} />
              ))
            : 'No events'}
        </SimpleGrid>
      ) : (
        <SimpleGrid>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} height={40} />
          ))}
        </SimpleGrid>
      )}
    </>
  );
};
