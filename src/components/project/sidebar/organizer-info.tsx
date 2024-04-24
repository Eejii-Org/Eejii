import { ProjectType } from '@/lib/db/enums';
import type { Project } from '@/lib/types';
import { Avatar, Button, Flex, Paper, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';

export const OrganizerInfo = ({ project }: { project: Project }) => {
  return (
    <Paper withBorder py={15} px={20} radius={'lg'}>
      <Stack>
        <Title order={4} ta={'center'}>
          Organizer
        </Title>
        <Flex gap={10} align={'center'} justify={'center'}>
          <Avatar />
          <Text ta={'center'} fw={500}>
            {project?.Owner?.organizationName
              ? project?.Owner?.organizationName
              : project?.Owner?.email}
          </Text>
        </Flex>
        {(project.type as unknown as ProjectType) ===
        ProjectType.FUNDRAISING ? (
          <Button
            fullWidth
            radius={'xl'}
            component={Link}
            href={`/projects/${project.slug}/donate`}
          >
            Хандивлах
          </Button>
        ) : (
          <Button fullWidth radius={'xl'}>
            Өргөдөл явуулах
          </Button>
        )}
      </Stack>
    </Paper>
  );
};
