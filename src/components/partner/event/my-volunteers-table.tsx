import { RequestStatusText } from '@/components/common/request-status-text';
import type { Event, MyVolunteer, RequestStatus } from '@/lib/types';
import { api } from '@/utils/api';
import {
  Avatar,
  Badge,
  Button,
  Flex,
  List,
  Modal,
  NumberInput,
  Paper,
  Skeleton,
  Space,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';
import {
  IconCertificate,
  IconMail,
  IconMapPin,
  IconPhone,
} from '@tabler/icons-react';

const AssignPoint = ({
  volunteer,
  event,
}: {
  volunteer: MyVolunteer;
  event: Event;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const maxPoint = event.maxPoint ?? 5;
  const context = api.useUtils();
  const { mutate: assignPoint, isLoading } =
    api.eventUser.assignPoint.useMutation({
      onSuccess: () => {
        context.eventUser.getMyVolunteer.invalidate();
        notifications.show({
          title: 'Success',
          message: 'Successfully assigned point',
        });
      },
    });
  const form = useForm({
    initialValues: {
      point: volunteer.EventParticipator.volunteeringPoint ?? 0,
    },
    validateInputOnChange: true,
    validate: {
      point: value =>
        value > maxPoint ? 'Value should not exceed max point' : null,
    },
  });

  function handleSubmit(values: typeof form.values) {
    assignPoint({
      id: volunteer.EventParticipator.id as unknown as string,
      point: values.point,
    });
  }

  return (
    <div>
      <Button leftSection={<IconPlus />} onClick={open}>
        Assess point
      </Button>
      <Modal.Root opened={opened} onClose={close} centered>
        <Modal.Overlay />
        <Modal.Content p={'lg'} radius={'lg'}>
          <Modal.Header>
            <Modal.Title>{volunteer.email}</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Text>
                This events max point to give volunteer is{' '}
                <span className="font-bold text-primary">{maxPoint}</span>
              </Text>
              <Space h="lg" />
              <NumberInput
                {...form.getInputProps('point')}
                placeholder="Assignt point"
                label="Point"
                radius={'md'}
                size="lg"
                allowDecimal={false}
              />
              <Button
                fullWidth
                mt={'lg'}
                type="submit"
                loading={isLoading}
                disabled={!form.isValid}
              >
                Submit
              </Button>
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};

const VolunteerRow = ({
  volunteer,
  event,
}: {
  volunteer: MyVolunteer;
  event: Event;
}) => {
  const [opened, { close }] = useDisclosure(false);
  // TODO skills
  const context = api.useUtils();
  const { mutate: generateCertificate, isLoading } =
    api.event.generateCertificate.useMutation({
      onError: err => {
        notifications.show({
          title: 'Error',
          message: err?.message,
          color: 'red',
        });
      },
      onSuccess: () => {
        context.eventUser.getMyVolunteer.invalidate({
          eventId: event?.id as unknown as string,
          page: 1,
          limit: 20,
        });
        notifications.show({
          title: 'Success',
          message: 'Successfully created certificate',
          color: 'green',
        });
      },
    });

  return (
    <Table.Tr>
      <Table.Td>
        {volunteer.firstName} {volunteer.lastName}
      </Table.Td>
      <Table.Td>
        <RequestStatusText
          status={volunteer?.EventParticipator.status as RequestStatus}
        />
      </Table.Td>
      <Table.Td>{volunteer.email}</Table.Td>
      <Table.Td>
        {volunteer.EventParticipator.volunteeringPoint &&
          !volunteer.EventParticipator.hasCertificate && (
            <Button
              leftSection={<IconCertificate />}
              variant="light"
              color="primary"
              onClick={() =>
                generateCertificate({
                  eventId: event.id as unknown as string,
                  volunteerId: volunteer.id,
                })
              }
              loading={isLoading}
            >
              Certificate
            </Button>
          )}
        {volunteer.EventParticipator.volunteeringPoint === 0 ||
          (!volunteer.EventParticipator.volunteeringPoint && (
            <AssignPoint volunteer={volunteer} event={event} />
          ))}
        {volunteer.EventParticipator.hasCertificate && (
          <Badge color="primary">Certificate given</Badge>
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
                  {volunteer.firstName} {volunteer.lastName}
                  Toslmon khiloo
                </Text>
                <List>
                  <List.Item icon={<IconMail />}>{volunteer.email}</List.Item>
                  <List.Item icon={<IconPhone />}>
                    {volunteer.phoneNumber}
                  </List.Item>
                  <List.Item icon={<IconMapPin />}>
                    {volunteer.Address?.city} {volunteer.Address?.provinceName}{' '}
                    {volunteer.Address?.street}
                  </List.Item>
                </List>
              </Stack>
              <Stack justify="space-between">
                <Stack>
                  <Text fw={500}>Bio:</Text>
                  <Text>{volunteer.bio ?? 'No bio'}</Text>
                </Stack>
                <Stack>
                  <Text fw={500}>Skills:</Text>
                  <Flex gap={10}>
                    {volunteer.skills
                      ? volunteer.skills?.map(s => <Badge key={s}>{s}</Badge>)
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
export const MyVolunteersTable = ({ event }: { event: Event }) => {
  const { data: myVolunteers, isLoading } =
    api.eventUser.getMyVolunteer.useQuery({
      eventId: event?.id as unknown as string,
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
            myVolunteers && myVolunteers?.items.length ? (
              myVolunteers.items.map((volunteer, i) => (
                <VolunteerRow
                  event={event}
                  volunteer={volunteer as unknown as MyVolunteer}
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
