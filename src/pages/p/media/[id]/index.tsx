import PartnerLayout from '@/components/layout/partner-layout';
import { getServerAuthSession } from '@/lib/auth';
import { appRouter } from '@/server/api/root';
import { db } from '@/server/db';
import { api } from '@/utils/api';
import {
  ActionIcon,
  Badge,
  Button,
  Container,
  Flex,
  Group,
  Image,
  Paper,
  Skeleton,
  Space,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { createServerSideHelpers } from '@trpc/react-query/server';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import superjson from 'superjson';

export default function MediaDetail(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { slug } = props;
  const { data: media, isLoading } = api.media.findBySlug.useQuery({
    slug: slug,
  });
  const image =
    process.env.NEXT_PUBLIC_AWS_PATH +
    '/' +
    media?.Images.find(i => i.type === 'main');

  return (
    <PartnerLayout>
      <Container fluid p={'xl'}>
        <Flex justify={'space-between'}>
          <Group>
            <ActionIcon
              component={Link}
              href={'/p/media'}
              radius={'xl'}
              size={'lg'}
              variant="light"
            >
              <IconArrowLeft />
            </ActionIcon>
          </Group>
          <Button
            component={Link}
            href={`/p/media/${media?.id}/edit`}
            radius={'xl'}
          >
            Edit details
          </Button>
        </Flex>
        <Space h={'lg'} />
        {!isLoading && media ? (
          <Stack>
            <Paper w="100%" h={200} withBorder p={20} radius={'xl'} py={30}>
              <Image
                w="100%"
                h={200}
                fit="contain"
                fallbackSrc="/images/placeholder.svg"
                src={image}
                alt="image"
                radius="sm"
              />
            </Paper>
            <Space h={'lg'} />
            <Paper withBorder p={20} radius={'xl'} py={30}>
              <Table>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>
                      <Text>Title</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text>{media.title}</Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <Text>Body</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text>{media.body}</Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <Text>Category</Text>
                    </Table.Td>
                    <Table.Td>
                      <Flex gap={10} justify={'start'}>
                        {media.Categories.map((c, i) => (
                          <Badge key={i}>{c.name}</Badge>
                        ))}
                      </Flex>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Paper>
          </Stack>
        ) : (
          <Stack>
            <Skeleton w={'100%'} h={200} />
            <Skeleton w={'100%'} h={500} />
          </Stack>
        )}
      </Container>
    </PartnerLayout>
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

  await helpers.media.findBySlug.prefetch({ slug: slug });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      slug,
    },
  };
};
