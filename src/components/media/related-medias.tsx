import type { Media } from '@/lib/types';
import { api } from '@/utils/api';
import {
  Alert,
  Center,
  SimpleGrid,
  Skeleton,
  Space,
  Title,
} from '@mantine/core';
import { MediaCard } from './card';

export const RelatedMedias = ({ id }: { id: string }) => {
  const { data: medias, isLoading } = api.media.findRelated.useQuery({
    limit: 3,
    excludeId: id,
  });
  if (isLoading) {
    return (
      <SimpleGrid cols={{ base: 1, lg: 3 }}>
        <Skeleton h={400} w={300} />
        <Skeleton h={400} w={300} />
        <Skeleton h={400} w={300} />
      </SimpleGrid>
    );
  }
  return (
    <div>
      <Center>
        <Title order={2}>Холбоотой мэдээллүүд</Title>
      </Center>
      <Space h={'xl'} />
      <SimpleGrid cols={{ base: 1, lg: 3 }}>
        {medias && medias.length > 0 ? (
          medias.map(media => (
            <MediaCard key={media.title} media={media as unknown as Media} />
          ))
        ) : (
          <Alert title="No result">No related medias to show</Alert>
        )}
      </SimpleGrid>
    </div>
  );
};
