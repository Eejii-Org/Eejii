import type { Media } from '@/lib/types';
import {
  Avatar,
  Button,
  Center,
  Divider,
  Flex,
  Paper,
  Space,
  Text,
  Title,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { FallbackImage } from '../common/fallback-image';

export const MediaDetail = ({ media }: { media: Media }) => {
  const image =
    process.env.NEXT_PUBLIC_AWS_PATH + '/' + media?.Images?.[0]?.path;
  return (
    <section className="relative">
      <FallbackImage
        src={image}
        radius={'lg'}
        width={1200}
        fullWidth
        height={400}
        alt="mediaNext"
      />
      <Center w={'100%'}>
        <Paper
          pos={'absolute'}
          mx={'auto'}
          top={200}
          maw={800}
          miw={{ base: 350, md: 700, lg: 800 }}
          radius={'xl'}
          py={'lg'}
          px={'xl'}
          shadow="md"
        >
          <Title mb={10} order={1}>
            {media.title}
          </Title>
          <Flex mb={10} justify={'start'} gap={5} align={'center'}>
            <Avatar />
            <Text c={'gray.7'} fz={22} fw={600}>
              {media.Owner.organizationName ?? media.Owner.email}
            </Text>
          </Flex>
          <Text c={'gray.7'} fz={18} fw={600}>
            Published at{' '}
            {format(media.createdAt as unknown as Date, 'LLL do yyyy, H:mm')}
          </Text>
          <Divider variant="dashed" my={5} size={5} />
          <Text fz={18}>{media.body}</Text>
          <Space h={'lg'} />
          <Flex justify={'start'}>
            <Button
              component={Link}
              href={'/media'}
              variant="subtle"
              leftSection={<IconArrowLeft />}
            >
              Буцах
            </Button>
          </Flex>
        </Paper>
      </Center>
    </section>
  );
};
