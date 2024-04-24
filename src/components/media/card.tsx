import type { Media } from '@/lib/types';
import { Badge, Box, Button, Image, Paper, Text } from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons-react';
import { format } from 'date-fns';
import Link from 'next/link';

export const MediaCard = ({ media }: { media: Media }) => {
  const image =
    process.env.NEXT_PUBLIC_AWS_PATH + '/' + media?.Images?.[0]?.path;
  return (
    <Paper>
      <Box h={250}>
        <Image
          loading="lazy"
          src={image ?? '/images/placeholder.svg'}
          fallbackSrc="/images/placeholder.svg"
          alt="mediaIMG"
          radius={'lg'}
          h={250}
          w={'100%'}
        />
      </Box>
      <Badge mt={'sm'} color="gray.3" c={'gray.8'} radius={'xl'}>
        {format(media?.createdAt as unknown as Date, 'yyyy-MM-dd HH:mm:ss')}
      </Badge>
      <Text fw={600} mt={'sm'}>
        {media.title}
      </Text>
      <Text lineClamp={4} mt={5} c="dimmed">
        {media.body}
      </Text>
      <Button
        component={Link}
        mt={'lg'}
        fullWidth
        variant="outline"
        href={`/media/${media.id}`}
        radius={'lg'}
        rightSection={<IconArrowUpRight />}
      >
        Унших
      </Button>
    </Paper>
  );
};
