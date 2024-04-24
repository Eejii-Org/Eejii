import { BadgeStep } from '@/components/form/form-stepper';
import type { Event } from '@/lib/db/types';
import cardClasses from '@/styles/CardGradient.module.css';
import {
  Avatar,
  Badge,
  Box,
  Flex,
  Group,
  Image,
  Paper,
  RingProgress,
  Space,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconCircleArrowDown } from '@tabler/icons-react';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';

const Accordion = dynamic(
  () => import('@mantine/core').then(el => el.Accordion),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

const AccordionItem = dynamic(
  () => import('@mantine/core').then(el => el.AccordionItem),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

const AccordionControl = dynamic(
  () => import('@mantine/core').then(el => el.AccordionControl),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

const AccordionPanel = dynamic(
  () => import('@mantine/core').then(el => el.AccordionPanel),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

export const EventCardV2 = ({ event }: { event: Event }) => {
  return (
    <Paper
      display={'flex'}
      p={20}
      withBorder
      radius="md"
      className={cardClasses.card}
    >
      <Stack w={'100%'}>
        <Flex gap={20}>
          <Image
            className="radius"
            radius={'lg'}
            h={160}
            w={200}
            alt=""
            src={'/images/projectss/main.png'}
          />
          <Flex justify={'around'} direction={'column'}>
            <Title order={1} fw={500}>
              {event?.title}
            </Title>
            <Text size="md" mt="sm" c="dimmed">
              {format(event?.startTime as unknown as Date, 'E MMMM-d yyy')} -{' '}
              {format(event?.endTime as unknown as Date, 'E MMMM-d yyy')}
            </Text>
            <Space h={'lg'} />
            <Badge>Childcare</Badge>
          </Flex>
        </Flex>
        <Accordion
          chevron={<IconCircleArrowDown size={40} stroke={1} />}
          chevronSize={40}
          defaultValue="Apples"
          styles={{
            item: {
              border: 'none',
            },
          }}
        >
          <AccordionItem value={'apple'}>
            <AccordionControl className="hover:bg-none">
              <Flex gap={10}>
                <Avatar />
                <Flex direction={'column'}>
                  <Text fw={500} fz={14}>
                    tosmolmophsnf@gmail.com
                  </Text>
                  <Text c={'dimmed'} fz={12}>
                    {' '}
                    1 month ago
                  </Text>
                </Flex>
              </Flex>
            </AccordionControl>
            <AccordionPanel>
              <Flex justify={'space-between'} align={'center'}>
                <Group>
                  <Avatar size={60} />
                  <Text fz={18} fw={500}>
                    Event progress
                  </Text>
                </Group>
                <RingProgress
                  sections={[{ value: 40, color: 'blue' }]}
                  size={80}
                  thickness={3}
                  label={
                    <Text c="blue" fw={700} ta="center" size="xl">
                      40%
                    </Text>
                  }
                />
              </Flex>
              <Box w={'100%'} px={20}>
                <Flex gap={15}>
                  <BadgeStep active={true} line step={1} />
                  <Text
                    w={'100%'}
                    size="lg"
                    py={20}
                    style={{
                      borderBottom: '1px solid var(--mantine-color-gray-3)',
                    }}
                    td={true && 'line-through'}
                  >
                    Send event creation request
                  </Text>
                </Flex>
                <Flex gap={15}>
                  <BadgeStep active={false} line step={2} />
                  <Text
                    w={'100%'}
                    size="lg"
                    py={20}
                    style={{
                      borderBottom: '1px solid var(--mantine-color-gray-3)',
                    }}
                  >
                    Create event
                  </Text>
                </Flex>
                <Flex gap={15}>
                  <BadgeStep active={false} line step={3} />
                  <Text
                    w={'100%'}
                    py={20}
                    style={{
                      borderBottom: '1px solid var(--mantine-color-gray-3)',
                    }}
                    size="lg"
                  >
                    Certificate
                  </Text>
                </Flex>
                <Flex gap={15}>
                  <BadgeStep active={false} step={4} />
                  <Text
                    w={'100%'}
                    py={20}
                    style={{
                      borderBottom: '1px solid var(--mantine-color-gray-3)',
                    }}
                    size="lg"
                  >
                    Unelgee ogoh
                  </Text>
                </Flex>
              </Box>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Stack>
    </Paper>
  );
};
