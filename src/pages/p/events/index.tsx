import PartnerLayout from '@/components/layout/partner-layout';
import { EventListPrivate } from '@/components/partner/event/list';
import { EventType, ProjectStatus } from '@/lib/db/enums';
import type { EventList } from '@/lib/types';
import segmentClasses from '@/styles/SegmentedControl.module.css';
import tabsClasses from '@/styles/Tabs.module.css';
import { api } from '@/utils/api';
import {
  BackgroundImage,
  Button,
  Container,
  Flex,
  SegmentedControl,
  Space,
  Tabs,
  Text,
  TextInput,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ManageEvents() {
  const router = useRouter();
  const { name, status, type } = router.query;

  const { data: events, isLoading } = api.event.getMyEvents.useQuery({
    name: name as string,
    status: (status as ProjectStatus) ?? ProjectStatus.APPROVED,
    type: (type as EventType) ?? EventType.EVENT,
  });

  return (
    <PartnerLayout>
      <Container fluid p={'xl'}>
        <BackgroundImage
          src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80"
          radius="sm"
          h={300}
        >
          <Flex p="md" justify={'space-between'} align={'center'}>
            <Text c="white" fz={'xl'} fw={700}>
              Manage projects
            </Text>
            <Button
              component={Link}
              href={'/p/events/new'}
              size="lg"
              radius={'xl'}
              c="white"
              fz={'lg'}
              leftSection={<IconPlus />}
            >
              Add project
            </Button>
          </Flex>
        </BackgroundImage>
        <Space h={'md'} />
        <Tabs
          defaultValue="event"
          classNames={{
            list: tabsClasses.list,
            tab: tabsClasses.tab,
          }}
        >
          <Tabs.List>
            <Tabs.Tab
              value="event"
              onClick={() =>
                router.push({
                  pathname: router.pathname,
                  query: {
                    type: EventType.EVENT,
                  },
                })
              }
            >
              Events
            </Tabs.Tab>
            <Tabs.Tab
              value="volunteering"
              onClick={() =>
                router.push({
                  pathname: router.pathname,
                  query: {
                    type: EventType.VOLUNTEERING,
                  },
                })
              }
            >
              Volunteering events
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
        <Space h={'lg'} />
        <TextInput
          label="Search"
          placeholder="Seach"
          description="Search what you need"
          inputWrapperOrder={['label', 'error', 'input', 'description']}
          variant="unstyled"
          size="lg"
          radius={0}
          styles={{
            input: {
              borderBottom: '1px solid var(--mantine-color-gray-3)',
            },
          }}
          onChange={e => {
            e.preventDefault();
            const value = e.currentTarget.value;
            router.push(
              {
                pathname: router.pathname,
                query: { ...router.query, name: value },
              },
              undefined,
              { scroll: false }
            );
          }}
        />

        <Space h={'lg'} />
        <SegmentedControl
          classNames={{
            control: segmentClasses.segment_control,
          }}
          color="white"
          fw={700}
          data={[
            ProjectStatus.APPROVED,
            ProjectStatus.PENDING,
            ProjectStatus.DONE,
            ProjectStatus.DENIED,
          ]}
          value={(status as string) ?? ProjectStatus.APPROVED}
          defaultValue={status as string}
          onChange={value => {
            router.push(
              {
                pathname: router.pathname,
                query: { ...router.query, status: value },
              },
              undefined,
              { scroll: false }
            );
          }}
          styles={{
            root: {
              background: 'none',
            },
            label: {
              borderRadius: '50px',
            },
            indicator: {
              backgroundColor: 'var(--mantine-color-blue-4)',
            },
          }}
        />

        <Space h={'lg'} />
        <EventListPrivate
          events={events as unknown as EventList[]}
          isLoading={isLoading}
        />
      </Container>
    </PartnerLayout>
  );
}
