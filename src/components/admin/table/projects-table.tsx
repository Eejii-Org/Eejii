import { ProjectStatus } from '@/lib/db/enums';
import type { Project } from '@/lib/types';
import { api } from '@/utils/api';

import { ActionIcon, Anchor, Badge, Table } from '@mantine/core';
import { IconChecks, IconX } from '@tabler/icons-react';
import { format } from 'date-fns';

const Row = ({ project }: { project: Project }) => {
  const context = api.useContext();
  const { mutate, isLoading } = api.project.changeStatus.useMutation({
    onSuccess: _ => {
      context.project.findAll.invalidate();
    },
  });
  return (
    <Table.Tr key={project.id as unknown as string}>
      <Table.Td>{project.title}</Table.Td>
      <Table.Td>
        {format(project.createdAt as unknown as Date, 'yyyy-M-dd H:mm:ss')}
      </Table.Td>
      <Table.Td>
        {project.status === ProjectStatus.APPROVED ? (
          <Badge color="blue">Approved</Badge>
        ) : project.status === ProjectStatus.PENDING ? (
          <Badge color="orange">Pending</Badge>
        ) : project.status === ProjectStatus.DENIED ? (
          <Badge color="red">Denied</Badge>
        ) : (
          <Badge color="green">Done</Badge>
        )}
      </Table.Td>
      <Table.Td>
        {project.enabled === true ? (
          <Badge color="blue">True</Badge>
        ) : (
          <Badge color="red">False</Badge>
        )}
      </Table.Td>
      <Table.Td>
        <Anchor href="#">
          {project.Owner.organizationName ?? project.Owner.email}
        </Anchor>
      </Table.Td>
      <Table.Td>
        <div className="flex flex-row gap-2">
          {project.status !== ProjectStatus.APPROVED && (
            <ActionIcon
              disabled={isLoading}
              color="blue"
              size={'lg'}
              radius={'xl'}
              onClick={() =>
                mutate({
                  id: project.id as unknown as string,
                  status: ProjectStatus.APPROVED,
                })
              }
            >
              <IconChecks />
            </ActionIcon>
          )}
          {project.status !== ProjectStatus.DENIED && (
            <ActionIcon
              disabled={isLoading}
              radius={'xl'}
              size={'lg'}
              color="red"
              onClick={() =>
                mutate({
                  id: project.id as unknown as string,
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
export const ProjectsTable = ({ data }: { data: Project[] }) => {
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
        {data.map(project => (
          <Row key={project.id as unknown as string} project={project} />
        ))}
      </Table.Tbody>
    </Table>
  );
};
