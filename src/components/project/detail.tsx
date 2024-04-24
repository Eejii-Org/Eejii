import { FallbackImage } from '@/components/common/fallback-image';
import { ProjectType } from '@/lib/db/enums';
import type { Project } from '@/lib/types';
import {
  ActionIcon,
  Badge,
  Container,
  Flex,
  Grid,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconLink,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { DonationsInfo } from './sidebar/donation';
import { CollaboratorsInfo } from './sidebar/collaborators-info';
import { OrganizerInfo } from './sidebar/organizer-info';
import Link from 'next/link';

export const ProjectDetail = ({
  project,
}: {
  project: Project | undefined;
}) => {
  const image =
    process.env.NEXT_PUBLIC_AWS_PATH +
    '/' +
    project?.Images?.find(i => i.type === 'main')?.path;
  console.log(project);
  return (
    <>
      {project && (
        <Container size={'xl'} mt={'lg'}>
          <Flex justify={'start'} gap={10} mb={10}>
            <ActionIcon
              component={Link}
              href={'/projects'}
              radius={'xl'}
              size={'xl'}
              variant="light"
            >
              <IconArrowLeft />
            </ActionIcon>
            <Title order={1} pl={10}>
              {project?.title}
            </Title>
          </Flex>
          <Grid columns={12} gutter={'xl'}>
            <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
              <Flex gap={20}>
                <Text c={'dimmed'}>
                  {format(
                    project?.startTime as unknown as Date,
                    'yyyy MMMM do H:mm:ss'
                  )}
                </Text>
                <Text c={'dimmed'}>
                  {format(
                    project?.endTime as unknown as Date,
                    'yyyy MMMM do H:mm:ss'
                  )}
                </Text>
              </Flex>
              <Stack mt={20}>
                <FallbackImage
                  src={image}
                  width={1000}
                  height={400}
                  alt="image"
                  radius={'lg'}
                />
                <Flex justify={'start'} gap={10}>
                  {project?.Categories &&
                    project?.Categories?.length > 0 &&
                    project?.Categories?.map(c => (
                      <Badge color="gray.5" key={c.id}>
                        {c.name}
                      </Badge>
                    ))}
                </Flex>
              </Stack>
              <Flex justify={'start'}>
                <Title
                  order={3}
                  p={10}
                  style={{
                    borderBottom: '2px solid var(--mantine-color-primary-8)',
                  }}
                >
                  Танилцуулага
                </Title>
              </Flex>
              <Text mt={20}>{project?.description}</Text>
              <Flex gap={10} mt={20}>
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
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Stack>
                <Paper withBorder p={5} radius={'lg'}>
                  <Text ta={'center'}>
                    {(project?.type as unknown as ProjectType) ===
                    ProjectType.FUNDRAISING
                      ? 'Fundraising project'
                      : 'Grant Fundraising'}
                  </Text>
                </Paper>
                <OrganizerInfo project={project} />
                <CollaboratorsInfo project={project} />
                <DonationsInfo projectId={project.id as unknown as string} />
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      )}
    </>
  );
};
