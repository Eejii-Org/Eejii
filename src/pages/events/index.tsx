import { FallbackImage } from '@/components/common/fallback-image';
import PublicLayout from '@/components/layout/public-layout';
import { EventList } from '@/components/list/event-list';
import { FeaturedEvents } from '@/components/list/featured-event-list';
import { EventType, ProjectStatus } from '@/lib/db/enums';
import type { Event } from '@/lib/types';
import { api } from '@/utils/api';
import {
  Button,
  Center,
  Container,
  Flex,
  Grid,
  Pagination,
  Paper,
  Space,
  Tabs,
  TextInput,
  Title,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Index() {
  const router = useRouter();
  const { type, q, page } = router.query;

  const [activePage, setPage] = useState(page ? +page : 1);
  const [search, setSearch] = useState(q);
  const [activeTab, setActiveTab] = useState<string | null>(
    (type as string) ?? EventType.EVENT
  );

  function handleSetPage(value: number) {
    setPage(value);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: value },
    });
  }

  function handleActiveTab(value: string | null) {
    router.push(
      {
        query: { ...router.query, type: value },
      },
      undefined,
      { scroll: false }
    );
    setActiveTab(value);
  }

  const {
    data: events,
    isLoading,
    refetch,
  } = api.event.findAll.useQuery({
    page: activePage,
    limit: 10,
    enabled: true,
    status: ProjectStatus.APPROVED,
    type: type as EventType,
    title: q as string,
  });

  useEffect(() => {
    refetch();
  }, [q]);

  const totalPages = events?.pagination.totalPages;
  const { data: bannerEvent } = api.banner.findAll.useQuery({
    positionCode: 'event_index_banner',
    limit: 1,
  });
  const bannerMainImage = bannerEvent
    ? process.env.NEXT_PUBLIC_AWS_PATH + '/' + bannerEvent.banners[0]?.path
    : '';
  return (
    <PublicLayout>
      <FallbackImage
        width={1600}
        radius={0}
        height={400}
        src={bannerMainImage}
        alt="main"
      />
      <Container size={'xl'}>
        <Grid gutter={'xl'} columns={12} className="-translate-y-16">
          <Grid.Col span={{ base: 12, md: 7, lg: 8 }}>
            <Paper shadow="md" py={30} px={40} radius={'lg'}>
              <Title mb={10}>Та ямар төсөл дэмжихийг хүсч байна вэ?</Title>
              <Flex justify={'space-between'} gap={10}>
                <TextInput
                  w={'100%'}
                  placeholder="Нэр"
                  required
                  defaultValue={q}
                  onChange={e => {
                    e.preventDefault();
                    setSearch(e.currentTarget.value);
                  }}
                  size="lg"
                  radius={'xl'}
                />
                <Button
                  onClick={() =>
                    router.push({
                      pathname: router.pathname,
                      query: { ...router.query, q: search },
                    })
                  }
                  radius={'xl'}
                  size="lg"
                  miw={150}
                >
                  Төсөл хайх
                </Button>
              </Flex>
            </Paper>
            <Space h={'xl'} />
            <Title order={3} mb={10}>
              Онцгой төсөл
            </Title>
            <FeaturedEvents />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 5, lg: 4 }}>
            <Paper
              withBorder
              // shadow="md"
              radius={'lg'}
              h={{ base: 300, md: 640, lg: 598 }}
            >
              <div>hi</div>
            </Paper>
          </Grid.Col>
        </Grid>
        <Tabs
          className="-translate-y-8"
          value={activeTab}
          onChange={handleActiveTab}
        >
          <Tabs.List>
            <Tabs.Tab value={EventType.EVENT}>Event</Tabs.Tab>
            <Tabs.Tab value={EventType.VOLUNTEERING}>
              Volunteering event
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
        <EventList events={events?.items as Event[]} isLoading={isLoading} />
        <Space h={'lg'} />
        <Center>
          <Pagination
            radius="xl"
            value={activePage}
            onChange={handleSetPage}
            total={totalPages ?? 1}
          />
        </Center>
      </Container>
    </PublicLayout>
  );
}
