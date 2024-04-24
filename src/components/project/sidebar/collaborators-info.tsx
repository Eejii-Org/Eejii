import { ProjectType } from '@/lib/db/enums';
import type { Project } from '@/lib/types';
import { priceFormat } from '@/lib/utils/price';
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Flex,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
} from '@mantine/core';

import { format } from 'date-fns';

export const CollaboratorsInfo = ({ project }: { project: Project }) => {
  return (
    <Paper withBorder py={15} px={20} radius={'lg'}>
      <Stack>
        <Text>Хамтрагч байгуулага</Text>
        {project?.Collaborators?.map(collaborator => (
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
        {(project.type as unknown as ProjectType) ===
        ProjectType.FUNDRAISING ? (
          <Group>
            <Divider w={'100%'} />
            <Box w={'100%'}>
              <Flex w={'100%'} justify={'space-between'}>
                <Group gap={2} display={'block'}>
                  <Text size="xs">Нийт цугласан</Text>
                  <Text fw={500} size="sm">
                    {priceFormat(project?.currentAmount ?? 0, 'MNT')}
                  </Text>
                </Group>
                <Group gap={2} display={'block'}>
                  <Text size="xs">Зорилго</Text>
                  <Text fw={500} size="sm">
                    {priceFormat(project?.goalAmount ?? 0, 'MNT')}
                  </Text>
                </Group>
              </Flex>
              <Progress
                value={Math.ceil(
                  ((project?.goalAmount ?? 0) * 100) /
                    (project?.currentAmount ?? 0)
                )}
                size={'lg'}
                color="primary"
              />
            </Box>
            <Divider w={'100%'} />
            <Flex align={'center'} justify={'space-between'} w={'100%'}>
              <Flex align={'center'}>
                <Badge variant="dot">
                  {project?.Donations?.length ?? 0} Хандивлагчид
                </Badge>
              </Flex>
              <Text>
                {format(
                  (project?.updatedAt as unknown as Date) ?? project.createdAt,
                  'MMM do yyyy '
                )}
              </Text>
            </Flex>
          </Group>
        ) : (
          <Text></Text>
        )}
      </Stack>
    </Paper>
  );
};
