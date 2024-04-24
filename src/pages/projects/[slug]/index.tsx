import { createServerSideHelpers } from '@trpc/react-query/server';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import superjson from 'superjson';

import PublicLayout from '@/components/layout/public-layout';
import { ProjectList } from '@/components/list/project-list';
import { getServerAuthSession } from '@/lib/auth';
import type { Project } from '@/lib/types';
import { appRouter } from '@/server/api/root';
import { db } from '@/server/db';
import { api } from '@/utils/api';
import { Container, LoadingOverlay, Space } from '@mantine/core';
import { FeaturedProjectDetail } from '@/components/project/featured-detail';
import { ProjectDetail } from '@/components/project/detail';

export default function EventViewPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { slug } = props;
  const { data: project, isLoading } = api.project.findBySlug.useQuery({
    slug: slug as string,
  });
  const { data: relatedProjects, isLoading: isRelatedLoading } =
    api.project.findRelated.useQuery({
      excludeId: project?.id as unknown as string,
      limit: 6,
    });
  if (isLoading) {
    return <LoadingOverlay />;
  }

  // const { mutate } = api.eventUser.sendRequest.useMutation({
  //   onSuccess: newReq => console.log(newReq),
  // });
  // function handleSendRequest() {
  //   mutate({ eventId: data?.id as unknown as string, role: 'mopper' });
  return (
    <PublicLayout>
      {project?.featured == true ? (
        <FeaturedProjectDetail project={project as unknown as Project} />
      ) : (
        <ProjectDetail project={project as unknown as Project} />
      )}
      <Container size={'xl'}>
        <Space h="lg" />
        <ProjectList
          projects={relatedProjects as unknown as Project[]}
          isLoading={isRelatedLoading}
        />
      </Container>
    </PublicLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getServerAuthSession(context);

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      db: db,
      userId: session?.user.id ? session.user.id : undefined,
      userType: session?.user.userType ? session?.user.userType : undefined,
      role: session?.user.role,
    },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if (typeof slug !== 'string') throw new Error('no id');

  await helpers.project.findBySlug.prefetch({ slug: slug });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      slug,
    },
  };
};
