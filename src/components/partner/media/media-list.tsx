import type { Media } from '@/lib/types';
import { api } from '@/utils/api';
import { SimpleGrid, Skeleton } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { MediaCard } from './card';

export const MediaList = () => {
  const session = useSession();
  const { data: medias, isLoading } = api.media.findAll.useQuery({
    ownerId: session.data?.user.id as string,
  });
  return (
    <SimpleGrid cols={{ base: 1, lg: 3 }}>
      {!isLoading ? (
        medias && medias?.length > 0 ? (
          medias?.map((media, i) => (
            <MediaCard media={media as unknown as Media} key={i} />
          ))
        ) : (
          'No media'
        )
      ) : (
        <Skeleton />
      )}
    </SimpleGrid>
  );
};
