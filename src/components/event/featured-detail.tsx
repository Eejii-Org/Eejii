import {
  ActionIcon,
  Flex,
  Container,
  Text,
  Title,
  Paper,
  Stack,
  Avatar,
  Group,
  Badge,
  Table,
  Button,
  Progress,
  Box,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { FallbackImage } from '../common/fallback-image';
import type { Event } from '@/lib/types';
import { Carousel } from '@mantine/carousel';
import { api } from '@/utils/api';
import { format } from 'date-fns';
import Link from 'next/link';

export const FeaturedEventDetail = ({
  event,
}: {
  event: Event | undefined;
}) => {
  const eventImage =
    event?.Images && event?.Images?.length > 0
      ? process.env.NEXT_PUBLIC_AWS_PATH +
        '/' +
        event?.Images.find(i => i.type === 'main')?.path
      : '';

  const ownerImage =
    event?.Images && event?.Images?.length > 0
      ? process.env.NEXT_PUBLIC_AWS_PATH +
        '/' +
        event?.Owner?.Images?.find(i => i.type === 'main')?.path
      : '';
  const shadowStyle = {
    boxShadow:
      '0px 0px 1px 0px #3C888D14, 0px 2px 6px 0px #3C888D29, 0px 12px 24px 0px #3C888D3D',
  };

  const { data: medias } = api.media.findAll.useQuery({
    projectId: event?.id as unknown as string,
  });

  const progressAmount =
    event?.Participators && event.Participators?.length > 0
      ? (event?.Participators?.length * 100) / +event?.maxVolunteers
      : 0;

  return (
    <>
      {event && (
        <div className="relative">
          <FallbackImage
            src={eventImage}
            width={1000}
            height={400}
            fullWidth
            alt="image"
          />
          <div className=" absolute left-0 top-10 w-full">
            <Container size={'xl'} mx={'auto'}>
              <Flex justify={'start'} gap={10} mb={10}>
                <ActionIcon
                  component={Link}
                  href={'/events'}
                  radius={'xl'}
                  size={'xl'}
                  variant="light"
                >
                  <IconArrowLeft />
                </ActionIcon>
              </Flex>
              <Flex
                c={'white'}
                direction={'column'}
                justify={'center'}
                align={'center'}
              >
                <Text>"{event?.Categories?.[0]?.name}"</Text>
                <Title>"{event?.title}"</Title>
                <Box mt={30}>
                  <Flex justify={'space-between'} gap={200}>
                    <Group gap={2}>
                      <Text fw={600} size="lg">
                        {(event?.maxVolunteers as unknown as number) ?? 0}
                      </Text>
                      <Text>Нийт цугласан</Text>
                    </Group>
                    <Group gap={2}>
                      <Text>Зорилго</Text>
                      <Text fw={600} size="lg">
                        {event?.Participators?.length ?? 0}
                      </Text>
                    </Group>
                  </Flex>
                  <Progress
                    value={progressAmount}
                    w={'100%'}
                    size={'lg'}
                    color="secondary"
                  />
                </Box>
                <Button mt={20}>Оролцох</Button>
              </Flex>
            </Container>
          </div>
          <Container
            size={'xl'}
            mx={'auto'}
            className="-translate-y-10 lg:-translate-y-20"
          >
            <Flex
              align={'center'}
              justify={'center'}
              gap={20}
              h={{ base: 200, lg: 170 }}
            >
              <Paper
                miw={200}
                h={'100%'}
                p={20}
                radius={'xl'}
                style={shadowStyle}
              >
                <Stack align="center" justify="space-between" h={'100%'}>
                  <Text>Санаачлагч</Text>
                  <Avatar src={ownerImage} size={50} />
                  <Text fw={500} fz={16}>
                    {event?.Owner?.organizationName}
                  </Text>
                </Stack>
              </Paper>
              <Paper h={'100%'} p={20} radius={'xl'} style={shadowStyle}>
                <Stack align="center" justify="space-between" h={'100%'}>
                  <Text>{event?.Participators?.length ?? 0} Дэмжигчид</Text>
                  <Group>
                    <Avatar src={ownerImage} size={50} />
                    <Avatar src={ownerImage} size={50} />
                    <Badge
                      ta={'center'}
                      color="primary.3"
                      p={'sm'}
                      radius={'xl'}
                      h={50}
                      miw={50}
                      fz={16}
                    >
                      +
                      {event?.Participators && event?.Participators?.length > 0
                        ? event?.Participators.length - 2
                        : 0}
                    </Badge>
                  </Group>
                </Stack>
              </Paper>
              <Paper h={'100%'} p={20} radius={'xl'} style={shadowStyle}>
                <Stack align="center" justify="space-between" h={'100%'}>
                  <Text>{event?.Collaborators?.length} Хамтрагчид</Text>
                  <Group>
                    <Avatar src={ownerImage} size={50} />
                    <Avatar src={ownerImage} size={50} />
                    <Badge
                      ta={'center'}
                      color="primary.3"
                      p={'sm'}
                      radius={'xl'}
                      h={50}
                      miw={50}
                      fz={16}
                    >
                      +
                      {event?.Collaborators && event?.Collaborators?.length > 0
                        ? event?.Collaborators.length - 2
                        : 0}
                    </Badge>
                  </Group>
                </Stack>
              </Paper>
            </Flex>
            <Flex justify={'start'} mt={10}>
              <Title
                order={3}
                p={10}
                style={{
                  borderBottom: '2px solid var(--mantine-color-primary-8)',
                }}
              >
                Танилцуулага
              </Title>
            </Flex>
            <Text mt={20}>{event?.description}</Text>

            {event?.Images && event.Images.length > 0 && (
              <Carousel>
                {event.Images.map((image, i) => {
                  const slideImage =
                    process.env.NEXT_PUBLIC_AWS_PATH + '/' + image.path; // Fix the syntax error here
                  return (
                    <Carousel.Slide key={i}>
                      <FallbackImage
                        width={200}
                        height={300}
                        alt="slideimg"
                        src={slideImage}
                      />
                    </Carousel.Slide>
                  );
                })}
              </Carousel>
            )}
            {medias && medias.length > 0 && (
              <>
                <Flex justify={'start'} mt={10}>
                  <Title order={3} p={10}>
                    Холбоотой нийтлэлүүд
                  </Title>
                </Flex>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Нийтлэгч</Table.Th>
                      <Table.Th>Огноо</Table.Th>
                      <Table.Th>Гарчиг</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {medias.map(m => (
                      <Table.Tr key={m.id as unknown as string}>
                        <Table.Td>{m.Owner?.organizationName}</Table.Td>
                        <Table.Td>
                          {format(
                            m?.createdAt as unknown as Date,
                            'yyyy MMMM do H:mm:ss'
                          )}
                        </Table.Td>
                        <Table.Td>{m.title}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </>
            )}
          </Container>
        </div>
      )}
    </>
  );
};
