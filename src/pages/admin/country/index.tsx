import DashboardLayout from '@/components/layout/dashboard-layout';
import { api } from '@/utils/api';
import {
  ActionIcon,
  Breadcrumbs,
  Anchor,
  Button,
  Flex,
  LoadingOverlay,
  Table,
} from '@mantine/core';
import { IconEye, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';

const TableRow = ({ code, name }: { code: string; name: string }) => {
  const { mutate, isLoading } = api.data.deleteCountry.useMutation();
  return (
    <Table.Tr>
      <Table.Td>{name}</Table.Td>
      <Table.Td>{code}</Table.Td>
      <Table.Td>
        <div className="flex flex-row gap-2">
          <ActionIcon
            radius={'xl'}
            size={'lg'}
            variant="light"
            component={Link}
            href={`/admin/country/${code}/states`}
          >
            <IconEye />
          </ActionIcon>
          <ActionIcon
            radius={'xl'}
            size={'lg'}
            color="red"
            loading={isLoading}
            onClick={() => mutate({ code: code })}
          >
            <IconTrash />
          </ActionIcon>
        </div>
      </Table.Td>
    </Table.Tr>
  );
};
export default function Index() {
  const { data, isLoading } = api.data.getCountries.useQuery();
  return (
    <DashboardLayout>
      <Flex>
        <Button component={Link} href={'/admin/country/new'}>
          Create
        </Button>
      </Flex>
      <Breadcrumbs mb="md" separator="→" separatorMargin="md" mt="xs">
        <Anchor href="/admin" component={Link}>
          Dashboard
        </Anchor>
        <Anchor href="/admin/country" component={Link}>
          Country
        </Anchor>
      </Breadcrumbs>
      {!isLoading && data ? (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Code</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((d, i) => (
              <TableRow code={d.code} name={d.name} key={i} />
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <LoadingOverlay visible />
      )}
    </DashboardLayout>
  );
}
