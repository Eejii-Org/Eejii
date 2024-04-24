import {
  ActionIcon,
  Flex,
  Container,
  Stack,
  Table,
  Avatar,
  Badge,
  Text,
  Title,
  Paper,
  Progress,
  Group,
  Box,
  Button,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { FallbackImage } from '../common/fallback-image';
import { priceFormat } from '@/lib/utils/price';
import type { Project } from '@/lib/types';
import { Carousel } from '@mantine/carousel';
import { api } from '@/utils/api';
import { format } from 'date-fns';
import Link from 'next/link';

export const FeaturedProjectDetail = ({
  project,
}: {
  project: Project | undefined;
}) => {
  const projectImage =
    process.env.NEXT_PUBLIC_AWS_PATH +
    '/' +
    project?.Images?.find(i => i.type === 'main')?.path;
  const ownerImage =
    project?.Images && project?.Images?.length > 0
      ? process.env.NEXT_PUBLIC_AWS_PATH +
        '/' +
        project?.Owner?.Images.find(i => i.type === 'main')?.path
      : '';
  const shadowStyle = {
    boxShadow:
      '0px 0px 1px 0px #3C888D14, 0px 2px 6px 0px #3C888D29, 0px 12px 24px 0px #3C888D3D',
  };

  const { data: medias } = api.media.findAll.useQuery({
    projectId: project?.id as unknown as string,
  });

  const progressAmount = Math.ceil(
    ((project?.goalAmount ?? 0) * 100) / (project?.currentAmount ?? 0)
  );

  return (
    <div className="relative">
      <FallbackImage
        src={projectImage}
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
              href={'/projects'}
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
            <Text>"{project?.Categories[0]?.name}"</Text>
            <Title>"{project?.title}"</Title>
            <Box mt={30}>
              <Flex justify={'space-between'} gap={200}>
                <Group gap={2}>
                  <Text fw={600} size="lg">
                    {priceFormat(project?.currentAmount ?? 0, 'MNT')}
                  </Text>
                  <Text>Нийт цугласан</Text>
                </Group>
                <Group gap={2}>
                  <Text>Зорилго</Text>
                  <Text fw={600} size="lg">
                    {priceFormat(project?.goalAmount ?? 0, 'MNT')}
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
          <Paper miw={200} h={'100%'} p={20} radius={'xl'} style={shadowStyle}>
            <Stack align="center" justify="space-between" h={'100%'}>
              <Text>Санаачлагч</Text>
              <Avatar src={ownerImage} size={50} />
              <Text fw={500} fz={16}>
                {project?.Owner?.organizationName}
              </Text>
            </Stack>
          </Paper>
          {/* <Paper py={15} px={20} radius={'xl'} style={shadowStyle}> */}
          {/*   <Stack align="center"> */}
          {/*     <Text>{project?.Participators?.length ?? 0} Дэмжигчид</Text> */}
          {/*     <Group> */}
          {/*       <Avatar src={ownerImage} size={50} /> */}
          {/*       <Avatar src={ownerImage} size={50} /> */}
          {/*       <Badge */}
          {/*         ta={'center'} */}
          {/*         color="primary.3" */}
          {/*         p={'sm'} */}
          {/*         radius={'xl'} */}
          {/*         h={50} */}
          {/*         miw={50} */}
          {/*         fz={16} */}
          {/*       > */}
          {/*         + */}
          {/*         {project?.Participators && project?.Participators?.length > 0 */}
          {/*           ? project?.Participators.length - 2 */}
          {/*           : 0} */}
          {/*       </Badge> */}
          {/*     </Group> */}
          {/*   </Stack> */}
          {/* </Paper> */}
          <Paper h={'100%'} p={20} radius={'xl'} style={shadowStyle}>
            <Stack align="center" justify="space-between" h={'100%'}>
              <Text>{project?.Collaborators?.length} Хамтрагчид</Text>
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
                  {project?.Collaborators && project?.Collaborators?.length > 0
                    ? project?.Collaborators.length - 2
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
        <Text mt={20}>{project?.description}</Text>

        {project?.Images && project.Images.length > 0 && (
          <Carousel>
            {project.Images.map((image, i) => {
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
  );
};
