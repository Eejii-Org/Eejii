import { FallbackImage } from '@/components/common/fallback-image';
import DashboardLayout from '@/components/layout/dashboard-layout';
import type { Banner } from '@/lib/types';
import { api } from '@/utils/api';
import {
  ActionIcon,
  Alert,
  Button,
  Center,
  Flex,
  Group,
  LoadingOverlay,
  Pagination,
  SegmentedControl,
  Table,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconSearch, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const BannerRow = ({ banner }: { banner: Banner }) => {
  const image = banner.path
    ? process.env.NEXT_PUBLIC_AWS_PATH + '/' + banner.path
    : '';
  const imageMobile = banner.mobilePath
    ? process.env.NEXT_PUBLIC_AWS_PATH + '/' + banner.mobilePath
    : '';

  const context = api.useUtils();
  const { mutate: deleteBanner, isLoading } =
    api.banner.deleteBanner.useMutation({
      onSuccess: () => {
        context.banner.findAll.invalidate({});
        notifications.show({
          title: 'Success',
          message: 'deleted banner',
        });
      },
    });

  return (
    <Table.Tr>
      <Table.Td>
        <FallbackImage
          src={image}
          alt={'desktop'}
          height={120}
          width={200}
          fit="contain"
        />
      </Table.Td>
      <Table.Td>
        <FallbackImage
          src={imageMobile}
          alt="mobile"
          height={120}
          width={200}
          fit="contain"
        />
      </Table.Td>
      <Table.Td>{banner.title}</Table.Td>
      <Table.Td>{banner.description}</Table.Td>
      <Table.Td>{banner.link}</Table.Td>
      <Table.Td>{banner?.Position?.code}</Table.Td>
      <Table.Td>
        <ActionIcon.Group>
          <ActionIcon
            size={'lg'}
            color="orange"
            component={Link}
            href={`/admin/banner/${banner.id}`}
          >
            <IconEdit />
          </ActionIcon>
          <ActionIcon
            color="red"
            size={'lg'}
            onClick={() => deleteBanner({ id: banner.id as unknown as string })}
            loading={isLoading}
          >
            <IconTrash />
          </ActionIcon>
        </ActionIcon.Group>
      </Table.Td>
    </Table.Tr>
  );
};

const BannerTable = () => {
  const router = useRouter();
  const { page, q } = router.query;
  const [activePage, setPage] = useState(page ? +page : 1);
  const { data, isLoading } = api.banner.findAll.useQuery({
    page: activePage,
    search: q as string,
    limit: 20,
  });
  const banners = data?.banners;
  if (isLoading) <LoadingOverlay visible />;

  const { data: total } = api.banner.findAll.useQuery({
    page: activePage,
    search: q as string,
  });
  const totalPages = total ? Math.ceil((total?.total as number) / 20) : 1;
  return (
    <div>
      {banners ? (
        <Table
          withColumnBorders
          withTableBorder
          withRowBorders
          highlightOnHover
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Desktop image</Table.Th>
              <Table.Th>Mobile image</Table.Th>
              <Table.Th>Title</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Link</Table.Th>
              <Table.Th>Position</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {banners.map(banner => (
              <BannerRow banner={banner as unknown as Banner} key={banner.id} />
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <Alert>No banners</Alert>
      )}
      <Center mt={10}>
        <Pagination
          total={totalPages}
          radius="xl"
          value={activePage}
          onChange={value => {
            setPage(value);
            router.push({
              pathname: router.pathname,
              query: { ...router.query, page: value },
            });
          }}
        />
      </Center>
    </div>
  );
};
const BannerPositionTable = () => {
  const { data: positions, isLoading } =
    api.banner.getBannerPositions.useQuery();

  return (
    <div>
      {!isLoading && positions ? (
        <Table
          withColumnBorders
          withTableBorder
          withRowBorders
          highlightOnHover
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Code</Table.Th>
              <Table.Th>Label</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {positions.map(p => (
              <Table.Tr key={p.id}>
                <Table.Td>{p.code}</Table.Td>
                <Table.Td>{p.label}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <LoadingOverlay visible />
      )}
    </div>
  );
};

export default function Index() {
  const router = useRouter();
  const { q } = router.query;
  const [search, setSearch] = useState(q ?? '');
  const [activeTab, setActiveTab] = useState<string | null>('Banner');

  return (
    <DashboardLayout>
      <Flex mb={20}>
        <Button component={Link} href={'/admin/banner/new'}>
          Create
        </Button>
      </Flex>
      <Group mb={20} gap="md" justify="space-between" grow>
        <SegmentedControl
          fullWidth
          miw={400}
          value={activeTab as string}
          onChange={setActiveTab}
          data={['Banner', 'Position']}
        />
        <TextInput
          miw={500}
          placeholder="Search"
          onChange={e => {
            e.preventDefault();
            setSearch(e.currentTarget.value);
          }}
          rightSection={
            <ActionIcon
              variant="transparent"
              onClick={() => {
                router.push({
                  pathname: router.pathname,
                  query: { ...router.query, q: search },
                });
              }}
            >
              <IconSearch />
            </ActionIcon>
          }
        />
      </Group>
      {activeTab === 'Banner' && <BannerTable />}
      {activeTab === 'Position' && <BannerPositionTable />}
    </DashboardLayout>
  );
}
