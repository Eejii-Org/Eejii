import type { Project } from '@/lib/types';
import { SimpleGrid, Skeleton } from '@mantine/core';
import { ProjectCard } from './card';

export const ProjectListPrivate = ({
  projects,
  isLoading,
}: {
  projects: Project[] | undefined;
  isLoading: boolean;
}) => {
  return (
    <>
      {!isLoading ? (
        <SimpleGrid spacing={20}>
          {projects && projects.length > 0
            ? projects?.map((item, i) => (
                <ProjectCard key={i} project={item as unknown as Project} />
              ))
            : 'No projects'}
        </SimpleGrid>
      ) : (
        <SimpleGrid>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} height={200} />
          ))}
        </SimpleGrid>
      )}
    </>
  );
};
