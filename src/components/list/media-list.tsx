import type { Media } from '@/lib/types';
import { Alert, SimpleGrid, Skeleton } from '@mantine/core';
import { MediaCard } from '../media/card';

export const MediaList = ({
  medias,
  isLoading,
}: {
  medias: Media[];
  isLoading: boolean;
}) => {
  return (
    <div>
      {!isLoading && medias ? (
        <SimpleGrid cols={{ base: 2, lg: 3, xl: 4 }}>
          {medias && medias.length > 0 ? (
            medias.map((media, i) => (
              <MediaCard key={i} media={media as unknown as Media} />
            ))
          ) : (
            <Alert variant="light" color="blue" title="No medias"></Alert>
          )}
        </SimpleGrid>
      ) : (
        <SimpleGrid>
          <Skeleton w={'100%'} h={400} />
          <Skeleton w={'100%'} h={400} />
          <Skeleton w={'100%'} h={400} />
          <Skeleton w={'100%'} h={400} />
          <Skeleton w={'100%'} h={400} />
          <Skeleton w={'100%'} h={400} />
        </SimpleGrid>
      )}
    </div>
  );
};
