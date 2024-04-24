import { ProjectStatus } from '@/lib/db/enums';
import type { Event } from '@/lib/types';
import { api } from '@/utils/api';

import { ActionIcon, Anchor, Badge, Table } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import { IconChecks, IconX } from '@tabler/icons-react';
import { format } from 'date-fns';
import Link from 'next/link';

const Row = ({ event }: { event: Event }) => {
  const context = api.useContext();
  const { mutate, isLoading } = api.event.changeStatus.useMutation({
    onSuccess: _ => {
      context.event.findAll.invalidate();
    },
  });
  return (
    <Table.Tr key={event.id as unknown as string}>
      <Table.Td>{event.title}</Table.Td>
      <Table.Td>
        {format(event.createdAt as unknown as Date, 'yyyy-M-dd H:mm:ss')}
      </Table.Td>
      <Table.Td>
        {event.status === ProjectStatus.APPROVED ? (
          <Badge color="blue">Approved</Badge>
        ) : event.status === ProjectStatus.PENDING ? (
          <Badge color="orange">Pending</Badge>
        ) : event.status === ProjectStatus.DENIED ? (
          <Badge color="red">Denied</Badge>
        ) : (
          <Badge color="green">Done</Badge>
        )}
      </Table.Td>
      <Table.Td>
        {event.enabled === true ? (
          <Badge color="blue">True</Badge>
        ) : (
          <Badge color="red">False</Badge>
        )}
      </Table.Td>
      <Table.Td>
        <Anchor href="#">
          {event.Owner.organizationName ?? event.Owner.email}
        </Anchor>
      </Table.Td>
      <Table.Td>
        <div className="flex flex-row gap-2">
          <ActionIcon
            color="gray"
            size={'lg'}
            radius={'xl'}
            component={Link}
            href={`/admin/events/${event.slug}`}
          >
            <IconEye />
          </ActionIcon>
          {event.status !== ProjectStatus.APPROVED && (
            <ActionIcon
              disabled={isLoading}
              color="blue"
              size={'lg'}
              radius={'xl'}
              onClick={() =>
                mutate({
                  id: event.id as unknown as string,
                  status: ProjectStatus.APPROVED,
                })
              }
            >
              <IconChecks />
            </ActionIcon>
          )}
          {event.status !== ProjectStatus.DENIED && (
            <ActionIcon
              disabled={isLoading}
              radius={'xl'}
              size={'lg'}
              color="red"
              onClick={() =>
                mutate({
                  id: event.id as unknown as string,
                  status: ProjectStatus.DENIED,
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
export const EventsTable = ({ data }: { data: Event[] }) => {
  return (
    <Table withTableBorder withColumnBorders highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Title</Table.Th>
          <Table.Th>Created at</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Is enabled</Table.Th>
          <Table.Th>Organization</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.map(event => (
          <Row key={event.id as unknown as string} event={event} />
        ))}
      </Table.Tbody>
    </Table>
  );
};
