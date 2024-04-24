import {
  Box,
  Center,
  Flex,
  Paper,
  SegmentedControl,
  Skeleton,
  Text,
} from '@mantine/core';
import { FallbackImage } from '@/components/common/fallback-image';
import { api } from '@/utils/api';
import type { Event } from '@/lib/types';
import { Carousel } from '@mantine/carousel';
import { RequestStatus, ProjectStatus } from '@/lib/db/enums';
import { useRouter } from 'next/router';
import { EventCardSmall } from '@/components/card/event-card-small';

export const MyEvents = ({ volunteerId }: { volunteerId: string }) => {
  const router = useRouter();
  const { tab } = router.query;

  const {
    data: events,
    isLoading,
    isFetching,
  } = api.event.getMyParticipating.useQuery({
    status:
      tab === 'request_send'
        ? RequestStatus.REQUEST_PENDING
        : RequestStatus.REQUEST_APPROVED,
    projectStatus: tab === 'done' ? ProjectStatus.DONE : ProjectStatus.APPROVED,
    page: 1,
    limit: 100,
  });

  function handleActiveChange(value: string) {
    router.push(
      {
        pathname: router.pathname,
        query: { tab: value },
      },
      undefined,
      { scroll: false }
    );
  }

  console.log(volunteerId);
  return (
    <Paper bg={'white'} p={20} shadow="xs">
      <Text fz="20" fw={500}>
        Арга хэмжээ
      </Text>
      <SegmentedControl
        onChange={handleActiveChange}
        mt={10}
        color="primary"
        fullWidth
        data={[
          { label: 'Хүсэлт илгээгдсэн', value: 'request_send' },
          {
            label: 'Удахгүй болох арга хэмжээ',
            value: 'starting_soon',
          },
          { label: 'Дууссан', value: 'done' },
        ]}
      />
      <Box pt={40} pb="20">
        {!isLoading && !isFetching && events ? (
          events.length > 0 ? (
            <Carousel
              withIndicators
              slideSize="33.333333%"
              slideGap="md"
              loop
              align="start"
              slidesToScroll={3}
            >
              {events.map(event => (
                <Carousel.Slide key={event.id} p={'sm'}>
                  <EventCardSmall event={event as unknown as Event} />
                </Carousel.Slide>
              ))}
            </Carousel>
          ) : (
            <div>
              <Text>
                Одоогоор ямар нэгэн арга хэмжээнд бүртгүүлээгүй байна. Арга
                хэмжээ хэсэгээс дэлгэрэнгүй мэдээлэл аваарай
              </Text>
              <Center mt="20">
                <FallbackImage
                  src={'/icons/volunteer.svg'}
                  width={100}
                  height={100}
                  alt="img"
                />
              </Center>
            </div>
          )
        ) : (
          <Flex gap={'20'}>
            <Skeleton h={'200'} w={'300'} />
            <Skeleton h={'200'} w={'300'} />
            <Skeleton h={'200'} w={'300'} />
          </Flex>
        )}
      </Box>
    </Paper>
  );
};
