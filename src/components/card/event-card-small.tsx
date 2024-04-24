import type { Event } from '@/lib/types';

import { Box, Flex, Paper, Stack, Text, Title } from '@mantine/core';
import { format } from 'date-fns';
import Link from 'next/link';
import { FallbackImage } from '../common/fallback-image';

export const EventCardSmall = ({ event }: { event: Event }) => {
  const image =
    Array.isArray(event.Images) && event.Images.length > 0
      ? process.env.NEXT_PUBLIC_AWS_PATH +
        '/' +
        event.Images.find(i => i.type === 'main')?.path
      : null;
  return (
    <Paper
      p={'md'}
      shadow="md"
      radius={'md'}
      style={{ overflow: 'hidden' }}
      component={Link}
      href={`/events/${event.slug}`}
    >
      <Box>
        <FallbackImage
          src={image as string}
          width={100}
          fullWidth
          height={100}
          radius={0}
          alt="event-image"
        />
      </Box>
      <Stack>
        <Title order={4}>{event.title}</Title>
        <Flex gap={10}>
          <Text size="sm">Хугацаа</Text>
          <Text size="sm" c={'dimmed'} fw={500}>
            {format(event?.startTime as unknown as Date, 'yyyy-M-dd H:mm')}
          </Text>
        </Flex>
        <Flex gap={10}>
          <Text size="sm">Зохион байгуулагч</Text>
          <Text size="sm">
            {event?.Owner.organizationName ?? event?.Owner.email}
          </Text>
        </Flex>
      </Stack>
    </Paper>
  );
};
