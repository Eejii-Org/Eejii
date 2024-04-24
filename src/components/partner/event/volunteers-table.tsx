import type { Event, MyVolunteer } from '@/lib/types';
import { api } from '@/utils/api';
import {
  Avatar,
  Badge,
  Button,
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
  IconUserPlus,
  IconEye,
  IconMail,
  IconMapPin,
  IconPhone,
} from '@tabler/icons-react';

const VolunteerRow = ({ v, eventId }: { v: MyVolunteer; eventId: string }) => {
  const [opened, { open, close }] = useDisclosure(false);

  const context = api.useUtils();
  const { mutate: invite, isLoading } =
    api.eventUser.inviteParticipator.useMutation({
      onError: err => {
        notifications.show({
          title: 'Oops. Error',
          message: err.message,
          color: 'red',
        });
      },
      onSuccess: () => {
        context.eventUser.getOtherVolunteers.invalidate();
        notifications.show({
          title: 'Success',
          message: 'You have invited ' + v.firstName,
          color: 'green',
        });
      },
    });
  return (
    <Table.Tr>
      <Table.Td>
        {v.firstName} {v.lastName}
      </Table.Td>
      <Table.Td>{v.email}</Table.Td>
      <Table.Td>
        <Button.Group>
          <Button leftSection={<IconEye />} variant="light" onClick={open}>
            Show
          </Button>
          <Button
            leftSection={<IconUserPlus />}
            variant="light"
            color="primary"
            loading={isLoading}
            onClick={() => invite({ userId: v.id, eventId: eventId })}
          >
            Invite
          </Button>
        </Button.Group>
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
export const OtherVolunteersTable = ({ event }: { event: Event }) => {
  const { data: volunteers, isLoading } =
    api.eventUser.getOtherVolunteers.useQuery(
      {
        eventId: event?.id as unknown as string,
        page: 1,
        limit: 20,
      },
      {}
    );
  console.log(volunteers);

  return (
    <Paper shadow="sm" p={'md'}>
      <Table withRowBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody mih={100}>
          {!isLoading ? (
            volunteers && volunteers?.items.length ? (
              volunteers.items.map((v, i) => (
                <VolunteerRow
                  eventId={event.id as unknown as string}
                  v={v as unknown as MyVolunteer}
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
