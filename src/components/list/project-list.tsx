import ProjectCardPublic from '@/components/card/project-card';
import type { Project } from '@/lib/types';
import { Alert, SimpleGrid, Skeleton } from '@mantine/core';

export const ProjectList = ({
  projects,
  isLoading,
}: {
  projects: Project[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
        <Skeleton h={420} w={'100%'} radius={'lg'} />
        <Skeleton h={420} w={'100%'} radius={'lg'} />
        <Skeleton h={420} w={'100%'} radius={'lg'} />
      </SimpleGrid>
    );
  }
  return (
    <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing={'lg'}>
      {projects?.length > 0 ? (
        projects.map((project, i) => (
          <ProjectCardPublic key={i} fund={project} />
        ))
      ) : (
        <Alert title="No result">No fundraisings to show</Alert>
      )}
    </SimpleGrid>
  );
};
