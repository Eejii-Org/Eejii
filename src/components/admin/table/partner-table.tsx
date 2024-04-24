import { RequestStatus } from '@/lib/db/enums';
import type { Contact, User } from '@/lib/types';
import { api } from '@/utils/api';

import { ActionIcon, Badge, List, Table, Text } from '@mantine/core';
import { IconChecks, IconX } from '@tabler/icons-react';
import { format } from 'date-fns';

const Row = ({ user }: { user: User }) => {
  const context = api.useContext();
  const { mutate, isLoading } = api.user.changeStatus.useMutation({
    onSuccess: _ => {
      context.partner.findAll.invalidate();
    },
  });
  return (
    <Table.Tr key={user.id as unknown as string}>
      <Table.Td>
        {format(user.createdAt as unknown as Date, 'yyyy-M-dd H:mm:ss')}
      </Table.Td>
      <Table.Td>{user.email}</Table.Td>
      <Table.Td>{user.phoneNumber}</Table.Td>
      <Table.Td>{user.organizationName}</Table.Td>
      <Table.Td>{user.organizationType}</Table.Td>
      <Table.Td>
        {user.requestStatus === RequestStatus.REQUEST_APPROVED ? (
          <Badge color="blue">Approved</Badge>
        ) : user.requestStatus === RequestStatus.REQUEST_PENDING ? (
          <Badge color="orange">Pending</Badge>
        ) : user.requestStatus === RequestStatus.REQUEST_DENIED ? (
          <Badge color="red">Denied</Badge>
        ) : (
          <Badge color="gray">No request</Badge>
        )}
      </Table.Td>
      <Table.Td>
        {user.contact !== undefined ? (
          <List>
            <Text size="sm">{(user?.contact as Contact)?.email}</Text>
            <Text size="sm">{(user?.contact as Contact)?.phone}</Text>
            <Text size="sm">{(user?.contact as Contact)?.instagramUrl}</Text>
            <Text size="sm">{(user?.contact as Contact)?.facebookUrl}</Text>
          </List>
        ) : (
          'No contact'
        )}
      </Table.Td>
      <Table.Td>
        <div className="flex flex-row gap-2">
          {user.requestStatus === RequestStatus.REQUEST_PENDING && (
            <ActionIcon
              disabled={isLoading}
              color="blue"
              size={'lg'}
              radius={'xl'}
              onClick={() =>
                mutate({
                  userId: user.id as unknown as string,
                  status: RequestStatus.REQUEST_APPROVED,
                })
              }
            >
              <IconChecks />
            </ActionIcon>
          )}
          {user.requestStatus !== RequestStatus.REQUEST_DENIED && (
            <ActionIcon
              disabled={isLoading}
              radius={'xl'}
              size={'lg'}
              color="red"
              onClick={() =>
                mutate({
                  userId: user.id as unknown as string,
                  status: RequestStatus.REQUEST_APPROVED,
                })
              }
            >
              <IconX />
            </ActionIcon>
          )}
        </div>
      </Table.Td>
    </Table.Tr>
  );
};
export const PartnerTable = ({ data }: { data: User[] }) => {
  return (
    <Table withTableBorder withColumnBorders highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Created at</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Phone number</Table.Th>
          <Table.Th>Organization name</Table.Th>
          <Table.Th>Organization type</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Contact</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.map(user => (
          <Row key={user.id as unknown as string} user={user} />
        ))}
      </Table.Tbody>
    </Table>
  );
};
