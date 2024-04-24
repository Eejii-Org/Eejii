import { FallbackImage } from '@/components/common/fallback-image';
import { EventType } from '@/lib/db/enums';
import type { Event } from '@/lib/types';
import { api } from '@/utils/api';
import {
  ActionIcon,
  Avatar,
  Button,
  Center,
  Flex,
  Group,
  Modal,
  Paper,
  Radio,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconLink,
} from '@tabler/icons-react';
import { useState } from 'react';

export const OrganizerInfo = ({ event }: { event: Event }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedRole, setSelectedRole] = useState<string>();

  const {
    mutate: participate,
    isLoading: isPending,
    isSuccess,
  } = api.eventUser.sendParticipateRequest.useMutation({
    onError: err => {
      notifications.show({
        title: 'Error',
        message: err.message,
        color: 'red',
      });
    },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Succesfully sent request',
        color: 'green',
      });
    },
  });
  const image =
    process.env.NEXT_PUBLIC_AWS_PATH +
    '/' +
    event?.Images?.find(i => i.type === 'main')?.path;

  return (
    <Paper withBorder py={15} px={20} radius={'lg'}>
      <Stack>
        <Title order={4} ta={'center'}>
          Зохион байгуулагч
        </Title>
        <Flex gap={10} align={'center'} justify={'center'}>
          <Avatar />
          <Text ta={'center'} fw={500}>
            {event?.Owner?.organizationName
              ? event?.Owner?.organizationName
              : event?.Owner?.email}
          </Text>
        </Flex>
        <Button fullWidth radius={'xl'} onClick={open}>
          Оролцох
        </Button>
        <Modal
          opened={opened}
          bg={'none'}
          onClose={close}
          size={'70%'}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
          withCloseButton={false}
          shadow="0"
          styles={{
            header: {
              backgroundColor: 'transparent',
            },
            content: {
              backgroundColor: 'transparent',
            },
          }}
        >
          <Paper bg={'white'} radius={'lg'} className="overflow-hidden">
            <FallbackImage
              src={image}
              width={800}
              height={400}
              fullWidth
              alt={'image'}
            />
            {isSuccess ? (
              <Stack px={30} py={20} gap={'sm'}>
                <Title order={5} className="text-center">
                  Бусадтай хуваалцаарай
                </Title>
                <Flex align={'center'} justify={'center'} gap={30}>
                  <ActionIcon radius={'lg'} variant="outline" size={'lg'} p={5}>
                    <IconBrandFacebook />
                  </ActionIcon>
                  <ActionIcon radius={'lg'} variant="outline" size={'lg'} p={5}>
                    <IconBrandInstagram />
                  </ActionIcon>
                  <ActionIcon radius={'lg'} variant="outline" size={'lg'} p={5}>
                    <IconBrandTwitter />
                  </ActionIcon>
                  <ActionIcon radius={'lg'} variant="outline" size={'lg'} p={5}>
                    <IconLink />
                  </ActionIcon>
                </Flex>
              </Stack>
            ) : (
              <Center px={30} py={20}>
                <Stack>
                  {(event.type as unknown as EventType) ===
                    EventType.VOLUNTEERING && (
                    <Radio.Group name="role" label="Select your role">
                      <Group mt="xs">
                        {event?.Roles?.map((role, i) => (
                          <Radio
                            key={i}
                            label={role.name}
                            disabled={role.slots === 0}
                            value={role.id as unknown as string}
                            description={`${role.slots} slots are available`}
                            onChange={e =>
                              setSelectedRole(e.currentTarget.value)
                            }
                          />
                        ))}
                      </Group>
                    </Radio.Group>
                  )}
                  <Button
                    size="lg"
                    radius="xl"
                    loading={isPending}
                    onClick={() => {
                      participate({
                        eventId: event.id as unknown as string,
                        roleId: selectedRole,
                      });
                    }}
                  >
                    Оролцох
                  </Button>
                </Stack>
              </Center>
            )}
          </Paper>
        </Modal>
      </Stack>
    </Paper>
  );
};
