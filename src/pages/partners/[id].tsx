import PublicLayout from '@/components/layout/public-layout';
import { BasicPartnerDetail } from '@/components/partner/public/detail/basic-detail';
import { StandartPartnerDetail } from '@/components/partner/public/detail/standart-detail';
import { getServerAuthSession } from '@/lib/auth';
import type { User } from '@/lib/types';
import { appRouter } from '@/server/api/root';
import { db } from '@/server/db';
import { api } from '@/utils/api';
import { LoadingOverlay } from '@mantine/core';
import { createServerSideHelpers } from '@trpc/react-query/server';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import superjson from 'superjson';

export default function PartnerDetail(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { id } = props;
  const { data: partner, isLoading } = api.partner.findById.useQuery({
    id: id as unknown as string,
  });
  const isStandart = true;
  return (
    <PublicLayout>
      {!isLoading && partner ? (
        <section>
          {isStandart ? (
            <StandartPartnerDetail partner={partner as unknown as User} />
          ) : (
            <BasicPartnerDetail partner={partner as unknown as User} />
          )}
        </section>
      ) : (
        <LoadingOverlay />
      )}
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

  const id = context.params?.id;

  if (typeof id !== 'string') throw new Error('no id');

  await helpers.partner.findById.prefetch({ id: id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
};
