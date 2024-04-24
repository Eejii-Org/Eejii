import type { Media } from '@/lib/types';
import { Badge, Card, Flex, Image, Space, Text, Title } from '@mantine/core';
import { format } from 'date-fns';
import Link from 'next/link';

export const MediaCard = ({ media }: { media: Media }) => {
  const image =
    process.env.NEXT_PUBLIC_AWS_PATH +
    '/' +
    media.Images.find(i => i.type === 'profile')?.path;
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      component={Link}
      href={`/p/media/${media.id}`}
    >
      <Card.Section>
        <Image
          mah={200}
          height={200}
          width={'100%'}
          src={image}
          fallbackSrc="/images/placeholder.svg"
          alt="image"
        />
      </Card.Section>
      <Space h="sm" />
      <Title order={3}>{media.title}</Title>
      <Text>{format(media?.createdAt as unknown as Date, 'PPP HH:mm')}</Text>
      <Flex justify="start" gap={10} mt="md" mb="xs">
        {media.Categories.map((c, i) => (
          <Badge color="pink" key={i}>
            {c.name}
          </Badge>
        ))}
      </Flex>
    </Card>
  );
};
