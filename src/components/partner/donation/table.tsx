import type { MyDonation } from '@/lib/types';
import { priceFormat } from '@/lib/utils/price';
import { Skeleton, Table } from '@mantine/core';
import { format } from 'date-fns';

export const DonationTable = ({
  donations,
  isLoading,
}: {
  donations: MyDonation[] | undefined;
  isLoading: boolean;
}) => {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Project</Table.Th>
          <Table.Th>Amount</Table.Th>
          <Table.Th>Date</Table.Th>
          <Table.Th>Organization</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {!isLoading ? (
          donations && donations.length > 0 ? (
            donations.map((d, i) => (
              <Table.Tr key={i}>
                <Table.Td>{d.Project.title}</Table.Td>
                <Table.Td>{priceFormat(d.amount, 'MNT')}</Table.Td>
                <Table.Td>
                  {format(d.createdAt as unknown as Date, 'Y/M/d')}
                </Table.Td>
                <Table.Td>{d.Project?.Owner?.organizationName}</Table.Td>
              </Table.Tr>
            ))
          ) : (
            'No donations'
          )
        ) : (
          <Table.Tr>
            <Table.Td>
              <Skeleton h={20} />
            </Table.Td>
            <Table.Td>
              <Skeleton h={20} />
            </Table.Td>
            <Table.Td>
              <Skeleton h={20} />
            </Table.Td>
            <Table.Td>
              <Skeleton h={20} />
            </Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  );
};
