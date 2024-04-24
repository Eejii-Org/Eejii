import type { Project } from '@/lib/db/types';
import cardClasses from '@/styles/CardGradient.module.css';
import {
  ActionIcon,
  Badge,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Spoiler,
  Text,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { format } from 'date-fns';
import Link from 'next/link';

export const GrantProjectCard = ({
  grantProject,
}: {
  grantProject: Project;
}) => {
  return (
    <Paper display={'flex'} withBorder radius="md" className={cardClasses.card}>
      <SimpleGrid w={'100%'} cols={{ base: 1, md: 2, lg: 2 }}>
        <Group miw={400}>
          <Flex
            justify={'center'}
            align={'center'}
            direction={'column'}
            w={'100px'}
            px={40}
            style={{ borderRight: '1px solid var(--mantine-color-gray-3)' }}
          >
            <Text fz="24">
              {format(grantProject?.createdAt as unknown as Date, 'MMM')}
            </Text>
            <Text fz="38">
              {format(grantProject?.createdAt as unknown as Date, 'd')}
            </Text>
            <Text c={'dimmed'}>
              {format(grantProject?.createdAt as unknown as Date, 'yyyy')}
            </Text>
          </Flex>
          <Flex justify={'around'} direction={'column'}>
            <Text
              fz={'md'}
              fw={500}
              c={'dimmed'}
              pl={10}
              className="border-l-[3px] border-primary  "
            >
              Хандив өгөх төсөл
            </Text>
            <Text size="xl" fw={500} mt="md">
              {grantProject?.title}
            </Text>
            <Text size="sm" mt="sm" c="dimmed">
              {(grantProject?.startTime as unknown as Date)?.toLocaleString(
                'default',
                {
                  year: 'numeric',
                  month: 'long',
                  day: '2-digit',
                }
              )}{' '}
              -{' '}
              {(grantProject?.endTime as unknown as Date)?.toLocaleString(
                'default',
                {
                  year: 'numeric',
                  month: 'long',
                  day: '2-digit',
                }
              )}
            </Text>
          </Flex>
        </Group>
        <Flex
          justify={'space-between'}
          p={'md'}
          direction={{ base: 'column', md: 'row' }}
        >
          <Spoiler maxHeight={100} showLabel="Show" hideLabel="Hide">
            <Flex rowGap={5} columnGap={5} wrap={'wrap'} maw={300}>
              <Badge>Community</Badge>
              <Badge>Events</Badge>
              <Badge>Childcare</Badge>
              <Badge>Events</Badge>
              <Badge>Events</Badge>
              <Badge>Community</Badge>
              <Badge>Events</Badge>
              <Badge>Childcare</Badge>
              <Badge>Events</Badge>
              <Badge>Events</Badge>
              <Badge>Events</Badge>
              <Badge>Events</Badge>
              <Badge>Childcare</Badge>
              <Badge>Childcare</Badge>
              <Badge>Childcare</Badge>
              <Badge>Childcare</Badge>
            </Flex>
          </Spoiler>
          <Flex align={'center'} justify={'center'} p={10}>
            <ActionIcon
              component={Link}
              href={`/p/manage/grant/${grantProject?.id}`}
              radius={'xl'}
              variant="subtle"
              size={'xl'}
            >
              <IconChevronRight size={50} stroke={1.5} />
            </ActionIcon>
          </Flex>
        </Flex>
      </SimpleGrid>
    </Paper>
  );
};
