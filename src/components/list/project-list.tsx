import type { Project } from '@/lib/types';
import { Card } from '../card/card';

export const ProjectList = ({
  projects,
  isLoading,
}: {
  projects: Project[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-20">
        <Card cardSize="small" cardType="project" contain loading={true} />
        <Card cardSize="small" cardType="project" contain loading={true} />
        <Card cardSize="small" cardType="project" contain loading={true} />
      </div>
    );
  }
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 sm:gap-20">
      {projects?.length > 0 ? (
        projects.map((project, i) => (
          <Card
            cardData={project}
            cardSize="small"
            cardType="project"
            contain
            loading={isLoading}
            key={i}
          />
        ))
      ) : (
        <div className="bg-primary rounded-lg text-center">
          No fundraisings to show
        </div>
      )}
    </div>
  );
};
