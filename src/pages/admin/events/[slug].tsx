import { FallbackImage } from '@/components/common/fallback-image';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { CalculatePointModal } from '@/components/modal/calculate-point.modal';
import { getServerAuthSession } from '@/lib/auth';
import { EventType, ProjectStatus } from '@/lib/db/enums';
import type { Contact } from '@/lib/types';
import { appRouter } from '@/server/api/root';
import { db } from '@/server/db';
import { api } from '@/utils/api';
import { Carousel } from '@mantine/carousel';
import {
  LoadingOverlay,
  Paper,
  Divider,
  Button,
  Badge,
  Flex,
  Table,
  Text,
  Group,
  Stack,
  Breadcrumbs,
  Anchor,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconChecks, IconX } from '@tabler/icons-react';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { format } from 'date-fns';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import superjson from 'superjson';

export default function AdminEventDetail(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { slug } = props;
  const context = api.useUtils();
  const { mutate: changeStatus, isLoading: isChangeStatusLoading } =
    api.event.changeStatus.useMutation({
      onSuccess: () => {
        context.event.findBySlug.invalidate({ slug: slug });
        notifications.show({
          title: 'Succes',
          message: 'Successfully changed status',
          color: 'green',
        });
      },
    });
  const { data: event, isLoading } = api.event.findBySlug.useQuery(
    {
      slug: slug as string,
    },
    { enabled: !!slug }
  );
  if (isLoading) <LoadingOverlay />;

  const images =
    event?.Images && event?.Images?.length > 0 ? (
      <Carousel
        dragFree
        slideSize="50%"
        slideGap="md"
        height={200}
        initialSlide={2}
      >
        {event?.Images?.map((image, i) => {
          const imgSrc = process.env.NEXT_PUBLIC_AWS_PATH + '/' + image.path;
          return (
            <Carousel.Slide key={i}>
              <FallbackImage
                src={imgSrc}
                alt="image"
                width={500}
                height={500}
                fullWidth
              />
            </Carousel.Slide>
          );
        })}
      </Carousel>
    ) : (
      'No images'
    );

  return (
    <DashboardLayout>
      <Breadcrumbs mb="md" separator="→" separatorMargin="md" mt="xs">
        <Anchor href="/admin" component={Link}>
          Dashboard
        </Anchor>
        <Anchor href="/admin/events" component={Link}>
          Events
        </Anchor>
        <Text c="dimmed" fw="600">
          {slug}
        </Text>
      </Breadcrumbs>
      {event && (
        <Paper p={'lg'} shadow="sm" bg={'white'}>
          <Flex justify="space-between" align="center">
            <Stack gap={'xs'}>
              {event?.status === ProjectStatus.APPROVED ? (
                <Badge size="lg" color="green">
                  Approved
                </Badge>
              ) : event?.status === ProjectStatus.DENIED ? (
                <Badge size="lg" color="red">
                  Denied
                </Badge>
              ) : event?.status === ProjectStatus.DONE ? (
                <Badge size="lg" color="gray">
                  Done
                </Badge>
              ) : (
                <Badge size="lg" color="orange">
                  Pending
                </Badge>
              )}
              <Text size="sm" c="dimmed" fw="500">
                {format(
                  event?.createdAt as unknown as Date,
                  'yyyy-MM-dd H:mm:s'
                )}
              </Text>
            </Stack>
            <Group gap={'xs'}>
              {(event?.type as unknown as EventType) ===
                EventType.VOLUNTEERING && (
                <CalculatePointModal slug={slug} point={event?.maxPoint} />
              )}
              {event?.status !== ProjectStatus.APPROVED && (
                <Button
                  color="blue"
                  leftSection={<IconChecks />}
                  loading={isChangeStatusLoading}
                  onClick={() =>
                    changeStatus({
                      id: event.id as unknown as string,
                      status: ProjectStatus.APPROVED,
                    })
                  }
                >
                  Approve
                </Button>
              )}
              {event?.status !== ProjectStatus.DENIED && (
                <Button
                  leftSection={<IconX />}
                  color="red"
                  loading={isChangeStatusLoading}
                  onClick={() =>
                    changeStatus({
                      id: event.id as unknown as string,
                      status: ProjectStatus.DENIED,
                    })
                  }
                >
                  Deny
                </Button>
              )}
            </Group>
          </Flex>
          <Divider w={'100%'} h={'sm'} mt="md" />
          {images}
          <Divider w={'100%'} h={'sm'} mt="md" />
          <Table>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>Type:</Table.Td>
                <Table.Td>
                  {event?.type &&
                  (event?.type as unknown as EventType) ===
                    EventType.VOLUNTEERING
                    ? 'Volunteering event'
                    : 'Event'}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Name:</Table.Td>
                <Table.Td>{event?.title}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Description:</Table.Td>
                <Table.Td>{event?.description}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Location:</Table.Td>
                <Table.Td>{event?.location}</Table.Td>
              </Table.Tr>
              {(event?.type as unknown as EventType) ===
                EventType.VOLUNTEERING && (
                <Table.Tr>
                  <Table.Td>Volunteering hours:</Table.Td>
                  <Table.Td>
                    {event?.volunteeringHours as unknown as number}
                  </Table.Td>
                </Table.Tr>
              )}
              {(event?.type as unknown as EventType) ===
                EventType.VOLUNTEERING && (
                <Table.Tr>
                  <Table.Td>Max volunteers:</Table.Td>
                  <Table.Td>
                    <span>{event?.maxVolunteers as unknown as number}</span>
                  </Table.Td>
                </Table.Tr>
              )}
              <Table.Tr>
                <Table.Td>Duration:</Table.Td>
                <Table.Td>
                  <Group>
                    <span>
                      {format(
                        event?.startTime as unknown as Date,
                        'yyyy/MM/dd'
                      )}
                    </span>
                    -
                    <span>
                      {format(event?.endTime as unknown as Date, 'yyyy/MM/dd')}
                    </span>
                  </Group>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Contact:</Table.Td>
                <Table.Td>
                  {event?.contact ? (
                    <Group>
                      <span>{(event?.contact as Contact)?.email}</span>
                      <span>{(event?.contact as Contact)?.phone}</span>
                    </Group>
                  ) : (
                    'No contact'
                  )}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Paper>
      )}
    </DashboardLayout>
  );
}
export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getServerAuthSession(context);

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      db: db,
      userId: session?.user.id ? session.user.id : undefined,
      userType: session?.user.userType ? session?.user.userType : undefined,
      role: session?.user.role,
    },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if (typeof slug !== 'string') throw new Error('no id');

  await helpers.event.findBySlug.prefetch({ slug: slug });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      slug,
    },
  };
};
