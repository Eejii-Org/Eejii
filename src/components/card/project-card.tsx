import type { Project } from '@/lib/types';

import { ProjectType } from '@/lib/db/enums';
import { priceFormat } from '@/lib/utils/price';
import {
  Avatar,
  Badge,
  Box,
  Flex,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { formatDistanceToNowStrict } from 'date-fns';
import Link from 'next/link';
import { FallbackImage } from '../common/fallback-image';

export default function ProjectCardPublic({ fund }: { fund: Project }) {
  const progressAmount =
    ((fund?.goalAmount ?? 0) * (fund?.currentAmount ?? 0)) / 100;
  const image =
    Array.isArray(fund.Images) && fund.Images.length > 0
      ? process.env.NEXT_PUBLIC_AWS_PATH +
        '/' +
        fund.Images.find(i => i.type === 'main')?.path
      : null;
  return (
    <Paper
      shadow="md"
      radius={'lg'}
      style={{ overflow: 'hidden' }}
      component={Link}
      href={`/projects/${fund.slug}`}
    >
      <Box pos={'relative'}>
        <FallbackImage
          src={image as string}
          width={300}
          height={200}
          radius={0}
          fullWidth
          alt="event-image"
        />
        {(fund.type as unknown as ProjectType) ===
          ProjectType.GRANT_FUNDRAISING && (
          <Badge
            radius={0}
            pos={'absolute'}
            bottom={0}
            right={0}
            variant="gradient"
            size="lg"
            gradient={{ from: 'primary.4', to: 'orange.5', deg: 90 }}
          >
            Grant
          </Badge>
        )}
      </Box>
      <Box p={20}>
        <Stack>
          <Title order={4}>{fund.title}</Title>
          <Flex align={'center'} gap={10}>
            <Avatar />
            <Text>{fund?.Owner.organizationName ?? fund?.Owner.email}</Text>
          </Flex>
          <Progress value={progressAmount} c={'orange'} />
          {(fund.type as unknown as ProjectType) ===
            ProjectType.FUNDRAISING && (
            <Flex justify={'space-between'} gap={40}>
              <Group gap={2}>
                <Text size="xs">Цугласан:</Text>
                <Text size="xs" c={'orange'} fw={500}>
                  {priceFormat(fund?.currentAmount ?? 0, 'MNT')}
                </Text>
              </Group>
              <Group gap={2}>
                <Text size="xs">Зорилго:</Text>
                <Text size="xs" c={'primary.7'} fw={500}>
                  {priceFormat(fund?.goalAmount ?? 0, 'MNT')}
                </Text>
              </Group>
            </Flex>
          )}
          <Flex>
            <Group>
              <IconClock />
              <Text>
                {formatDistanceToNowStrict(fund?.endTime as unknown as Date)}
              </Text>
            </Group>
          </Flex>
        </Stack>
      </Box>
    </Paper>
  );
}
