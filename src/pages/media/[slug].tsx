import PublicLayout from '@/components/layout/public-layout';
import { MediaDetail } from '@/components/media/media-detail';
import { RelatedMedias } from '@/components/media/related-medias';
// import type { Media } from '@/lib/types';
import { appRouter } from '@/server/api/root';
import { db } from '@/server/db';
// import { api } from '@/utils/api';
import { createServerSideHelpers } from '@trpc/react-query/server';
import type {
  GetServerSideProps,
  //  InferGetServerSidePropsType
} from 'next';
import superjson from 'superjson';

export default function Detail() {
  // props: InferGetServerSidePropsType<typeof getServerSideProps>
  // const { slug } = props;
  // const { data: media } = api.media.findBySlug.useQuery({
  //   slug: slug as string,
  // });

  return (
    <PublicLayout>
      <div className="md:container mb-16 flex flex-col gap-20 md:mt-5">
        <MediaDetail
        // media={media as unknown as Media}
        />
        <div className="max-md:container">
          <RelatedMedias
          // id={media?.id as string}
          />
        </div>
      </div>
    </PublicLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      db: db,
      userId: undefined,
      userType: undefined,
      role: undefined,
    },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if (typeof slug !== 'string') throw new Error('no id');

  await helpers.media.findBySlug.prefetch({ slug: slug });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      slug,
    },
  };
};
