import PartnerLayout from '@/components/layout/partner-layout';
import { MediaForm } from '@/components/partner/media/media-form';
import { getServerAuthSession } from '@/lib/auth';
import handleImageUpload from '@/lib/hooks/upload-image';
import type { Media, S3ParamType } from '@/lib/types';
import imageResizer from '@/lib/utils/image-resizer';
import type { mediaCreateSchema } from '@/lib/validation/media-schema';
import { appRouter } from '@/server/api/root';
import { db } from '@/server/db';
import { api } from '@/utils/api';
import {
  ActionIcon,
  Button,
  Container,
  Flex,
  Group,
  LoadingOverlay,
  Space,
} from '@mantine/core';
import type { FileWithPath } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft } from '@tabler/icons-react';
import { createServerSideHelpers } from '@trpc/react-query/server';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import superjson from 'superjson';
import type { z } from 'zod';

export default function EditMedia(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { slug } = props;
  const { data: media, isLoading } = api.media.findBySlug.useQuery({
    slug: slug,
  });
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);

  const context = api.useUtils();
  const { mutate: createPresignedUrl } =
    api.media.createPresignedUrl.useMutation({
      onSuccess: res => {
        const { url, fields } = res?.data as unknown as {
          url: string;
          fields: S3ParamType;
        };
        const file = files.find(f => f.name === res.fileName);
        handleImageUpload(url, fields, file as File);
      },
    });

  const { mutate: update, isLoading: isCreateLoading } =
    api.media.updateMedia.useMutation({
      onSuccess: res => {
        if (files.length > 0) {
          files.map(file => {
            createPresignedUrl({
              mediaId: res,
              name: file?.name as string,
              type: 'main',
              contentType: file?.type as string,
            });
          });
        }
        context.user.getMe.invalidate();
        notifications.show({
          title: 'Success',
          message: 'Successfully created media',
        });
        router.push('/p/media');
      },
    });

  async function handleSetFiles(images: FileWithPath[]) {
    const resizedFiles = await Promise.all(
      images.map(async file => {
        const resizedFile = await imageResizer(file, 600, 800);
        return resizedFile;
      })
    );
    setFiles(resizedFiles as unknown as File[]);
  }

  function handleSubmit(values: z.infer<typeof mediaCreateSchema>) {
    const formValues = { ...values, mediaId: media?.id as string };
    update(formValues);
  }

  return (
    <PartnerLayout>
      <Container fluid p={'xl'}>
        <Flex justify={'space-between'}>
          <Group>
            <ActionIcon
              component={Link}
              href={'/p/media'}
              radius={'xl'}
              size={'lg'}
              variant="light"
            >
              <IconArrowLeft />
            </ActionIcon>
          </Group>
          <Button component={Link} href={`/p/media/${media?.id}`} radius={'xl'}>
            Edit details
          </Button>
        </Flex>
        <Space h={'lg'} />
        {!isLoading && media ? (
          <MediaForm
            handleSubmit={handleSubmit}
            handleSetFiles={handleSetFiles}
            media={media as unknown as Media}
            files={files}
            setFiles={setFiles}
            isPending={isCreateLoading}
          />
        ) : (
          <LoadingOverlay visible />
        )}
      </Container>
    </PartnerLayout>
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

  await helpers.media.findBySlug.prefetch({ slug: slug });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      slug,
    },
  };
};
