import type { Project } from '@/lib/db/types';
import { SimpleGrid, Skeleton } from '@mantine/core';
import { GrantProjectCard } from './card';

export const GrantProjectListPrivate = ({
  grantProjects,
  isLoading,
}: {
  grantProjects: Project[] | undefined;
  isLoading: boolean;
}) => {
  return (
    <>
      {!isLoading ? (
        <SimpleGrid spacing={20}>
          {grantProjects && grantProjects.length > 0
            ? grantProjects?.map((item, i) => (
                <GrantProjectCard
                  key={i}
                  grantProject={item as unknown as Project}
                />
              ))
            : 'No grant projects'}
        </SimpleGrid>
      ) : (
        <SimpleGrid>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} height={40} />
          ))}
        </SimpleGrid>
      )}
    </>
  );
};
