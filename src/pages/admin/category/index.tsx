import DashboardLayout from '@/components/layout/dashboard-layout';
import { api } from '@/utils/api';
import { Button, Flex, LoadingOverlay, Table } from '@mantine/core';
import Link from 'next/link';

export default function Index() {
  const { data, isLoading } = api.category.findAll.useQuery({
    type: null,
    name: null,
  });
  return (
    <DashboardLayout>
      <Flex>
        <Button component={Link} href={'/admin/category/new'}>
          Create
        </Button>
      </Flex>
      {!isLoading && data ? (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map(d => (
              <Table.Tr key={d.id}>
                <Table.Td>{d.name}</Table.Td>
                <Table.Td>{d.type}</Table.Td>
                <Table.Td>Action</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <LoadingOverlay visible />
      )}
    </DashboardLayout>
  );
}
