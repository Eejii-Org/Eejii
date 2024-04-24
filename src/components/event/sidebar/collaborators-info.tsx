import { EventType } from '@/lib/db/enums';
import type { Event } from '@/lib/types';
import {
  Avatar,
  Box,
  Divider,
  Flex,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
} from '@mantine/core';

export const CollaboratorsInfo = ({ event }: { event: Event }) => {
  const progressAmount =
    event?.Participators && event?.Participators?.length > 0
      ? (event?.Participators?.length * 100) / +event?.maxVolunteers
      : 0;
  return (
    <Paper withBorder py={15} px={20} radius={'lg'}>
      <Stack>
        <Text>Хамтрагч байгуулага</Text>
        {event?.Collaborators?.map(collaborator => (
          <Flex
            align={'center'}
            key={collaborator.id as unknown as string}
            gap="md"
          >
            <Avatar />
            <Text>
              {collaborator.User?.organizationName ?? collaborator.User?.email}
            </Text>
          </Flex>
        ))}
        {(event.type as unknown as EventType) === EventType.VOLUNTEERING && (
          <Group>
            <Divider w={'100%'} />
            <Box w={'100%'}>
              <Flex w={'100%'} justify={'space-between'}>
                <Group gap={2} display={'block'}>
                  <Text size="xs">Нийт</Text>
                  <Text fw={500} size="sm">
                    {(event?.maxVolunteers as unknown as number) ?? 0}
                  </Text>
                </Group>
                <Group gap={2} display={'block'}>
                  <Text size="xs">Зорилго</Text>
                  <Text fw={500} size="sm">
                    {event?.Participators?.length ?? 0}
                  </Text>
                </Group>
              </Flex>
              <Progress value={progressAmount} size={'lg'} color="primary" />
            </Box>
            <Divider w={'100%'} />
          </Group>
        )}
        <Text>Байршил: {event.location}</Text>
        <Text>Өргөдөл хүлээн авах хугацаа </Text>
      </Stack>
    </Paper>
  );
};
