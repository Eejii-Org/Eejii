import { RequestStatusText } from '@/components/common/request-status-text';
import {
  RequestType,
  type RequestStatus,
  type Event,
  type MyVolunteer,
} from '@/lib/types';
import { api } from '@/utils/api';
import {
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Flex,
  List,
  Modal,
  Paper,
  Skeleton,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconChecks,
  IconEye,
  IconMail,
  IconMapPin,
  IconPhone,
  IconX,
} from '@tabler/icons-react';

const VolunteerRow = ({ v, eventId }: { eventId: string; v: MyVolunteer }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const contenxt = api.useUtils();
  const { mutate, isLoading } =
    api.eventUser.handleParticipantRequest.useMutation({
      onSuccess: () => {
        contenxt.eventUser.getEventsApplicants.invalidate({
          eventId: eventId,
          page: 1,
          limit: 20,
        });
      },
    });
  const { mutate: deleteRequest, isLoading: isDeleteLoading } =
    api.eventUser.deleteParticipatorRequest.useMutation({
      onSuccess: () => {
        contenxt.eventUser.getEventsApplicants.invalidate({
          eventId: eventId,
          page: 1,
          limit: 20,
        });
        notifications.show({
          message: 'You have successfully delete the request',
          title: 'Success',
        });
      },
    });

  // TODO skills
  return (
    <Table.Tr>
      <Table.Td>
        {v.EventParticipator.type === RequestType.INVITATION &&
          'You have invited '}
        <Text fw={600}>
          {v.firstName} {v.lastName}
        </Text>
        {v.EventParticipator.type === RequestType.REQUEST &&
          'Requested to join'}
      </Table.Td>
      <Table.Td>
        <RequestStatusText
          status={v?.EventParticipator.status as RequestStatus}
        />
      </Table.Td>
      <Table.Td>{v.email}</Table.Td>
      <Table.Td>
        {v.EventParticipator.type === RequestType.REQUEST ? (
          <ButtonGroup>
            <Button leftSection={<IconEye />} variant={'light'} onClick={open}>
              Show
            </Button>
            <Button
              leftSection={<IconChecks />}
              variant={'light'}
              color="primary"
              loading={isLoading}
              onClick={() =>
                mutate({
                  id: v.EventParticipator.id as unknown as string,
                  status: 'REQUEST_APPROVED',
                })
              }
            >
              Approve
            </Button>
            <Button
              leftSection={<IconX />}
              variant={'light'}
              color={'red'}
              loading={isLoading}
              onClick={() =>
                mutate({
                  id: v.EventParticipator.id as unknown as string,
                  status: 'REQUEST_DENIED',
                })
              }
            >
              Deny
            </Button>
          </ButtonGroup>
        ) : (
          <ButtonGroup>
            <Button leftSection={<IconEye />} variant={'light'} onClick={open}>
              Show
            </Button>
            <Button
              leftSection={<IconX />}
              variant={'light'}
              color="red"
              loading={isDeleteLoading}
              onClick={() =>
                deleteRequest({
                  id: v.EventParticipator.id as unknown as string,
                })
              }
            >
              Unsend request
            </Button>
          </ButtonGroup>
        )}
        <Modal.Root opened={opened} onClose={close} size="66%">
          <Modal.Overlay />
          <Modal.Content p={40} radius={'lg'}>
            <Flex gap={40}>
              <Stack>
                <Avatar
                  className="radius"
                  radius={'lg'}
                  size={200}
                  alt=""
                  src={'/images/projectss/main.png'}
                />
                <Text fw={500}>
                  {v.firstName} {v.lastName}
                  Toslmon khiloo
                </Text>
                <List>
                  <List.Item icon={<IconMail />}>{v.email}</List.Item>
                  <List.Item icon={<IconPhone />}>{v.phoneNumber}</List.Item>
                  <List.Item icon={<IconMapPin />}>
                    {v.Address?.city} {v.Address?.provinceName}{' '}
                    {v.Address?.street}
                  </List.Item>
                </List>
              </Stack>
              <Stack justify="space-between">
                <Stack>
                  <Text fw={500}>Bio:</Text>
                  <Text>{v.bio ?? 'No bio'}</Text>
                </Stack>
                <Stack>
                  <Text fw={500}>Skills:</Text>
                  <Flex gap={10}>
                    {v.skills
                      ? v.skills?.map(s => <Badge key={s}>{s}</Badge>)
                      : 'No skills'}
                  </Flex>
                </Stack>
              </Stack>
            </Flex>
            <Flex justify={'end'}>
              <Button radius={'xl'} onClick={close}>
                Close
              </Button>
            </Flex>
          </Modal.Content>
        </Modal.Root>
      </Table.Td>
    </Table.Tr>
  );
};
export const VolunteerApplicantsTable = ({ event }: { event: Event }) => {
  const { data: applicants, isLoading } =
    api.eventUser.getEventsApplicants.useQuery({
      eventId: event.id as unknown as string,
      page: 1,
      limit: 20,
    });

  return (
    <Paper shadow="sm" p={'md'}>
      <Table withRowBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody mih={100}>
          {!isLoading ? (
            applicants && applicants?.items.length ? (
              applicants.items.map((v, i) => (
                <VolunteerRow
                  v={v as unknown as MyVolunteer}
                  eventId={event.id as unknown as string}
                  key={i}
                />
              ))
            ) : (
              <Table.Tr>
                <Table.Td>'No volunteers'</Table.Td>
              </Table.Tr>
            )
          ) : (
            <Table.Tr>
              <Table.Td>
                <Skeleton h={40} />
              </Table.Td>
              <Table.Td>
                <Skeleton h={40} />
              </Table.Td>
              <Table.Td>
                <Skeleton h={40} />
              </Table.Td>
              <Table.Td>
                <Skeleton h={40} />
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Paper>
  );
};
