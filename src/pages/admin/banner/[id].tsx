import { BannerForm } from '@/components/admin/form/banner-form';
import { FallbackImage } from '@/components/common/fallback-image';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { getServerAuthSession } from '@/lib/auth';
import handleImageUpload from '@/lib/hooks/upload-image';
import type { Banner, S3ParamType } from '@/lib/types';
import imageResizer from '@/lib/utils/image-resizer';
import { appRouter } from '@/server/api/root';
import { db } from '@/server/db';
import { api } from '@/utils/api';
import {
  ActionIcon,
  Divider,
  Flex,
  InputLabel,
  LoadingOverlay,
  Paper,
  Space,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  type FileWithPath,
} from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft, IconX } from '@tabler/icons-react';
import { createServerSideHelpers } from '@trpc/react-query/server';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import superjson from 'superjson';

type BannerFormValuesType = {
  title: string | null;
  link: string | null;
  description: string | null;
  positionCode: string;
};

export default function Edit(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { id } = props;
  const { data: banner, isLoading } = api.banner.findById.useQuery({
    id: id as string,
  });
  if (isLoading) <LoadingOverlay visible />;

  const router = useRouter();
  const [bannerDesktop, setBannerDesktop] = useState<File | null>(null);
  const [bannerMobile, setBannerMobile] = useState<File | null>(null);

  async function handleSetBannerDesktop(files: FileWithPath[]) {
    if (files.length > 0) {
      const resizedFile = await imageResizer(files[0] as File, 1440, 700);
      setBannerDesktop(resizedFile as unknown as File);
    }
  }
  async function handleSetBannerMobile(files: FileWithPath[]) {
    if (files.length > 0) {
      const resizedFile = await imageResizer(files[0] as File, 800, 600);
      setBannerMobile(resizedFile as unknown as File);
    }
  }

  const context = api.useUtils();
  const { mutate: deleteImage, isLoading: isDeletePending } =
    api.banner.deleteImage.useMutation({
      onSuccess: res => {
        context.banner.findById.invalidate({ id: res.id });
        notifications.show({
          title: 'Success',
          message: 'Delete successful',
        });
      },
    });
  const { mutate: updateBanner, isLoading: isCreateBannerLoading } =
    api.banner.updateBanner.useMutation({
      onSuccess: res => {
        if (res.data) {
          const desktopRes = res.data as unknown as {
            url: string;
            fields: S3ParamType;
          };
          handleImageUpload(
            desktopRes.url as string,
            desktopRes.fields as S3ParamType,
            bannerDesktop as File
          );
        }
        if (res.dataMobile) {
          const mobileRes = res.dataMobile as unknown as {
            url: string;
            fields: S3ParamType;
          };
          handleImageUpload(
            mobileRes.url,
            mobileRes.fields,
            bannerMobile as File
          );
        }

        notifications.show({
          title: 'Success',
          message: 'Successfully edited banner',
        });
        router.push('/admin/banner');
      },
    });

  function handleBannerSubmit(bannerValues: BannerFormValuesType) {
    const bannerFormValues = {
      ...bannerValues,
      id: banner?.id as string,
      contentType: bannerDesktop?.type as string,
      name: bannerDesktop?.name as string,
      contentTypeMobile: bannerMobile?.type as string,
      nameMobile: bannerMobile?.name as string,
    };
    updateBanner(bannerFormValues);
  }

  const bannerImage = banner?.path
    ? process.env.NEXT_PUBLIC_AWS_PATH + '/' + banner?.path
    : null;
  const bannerImageMobile = banner?.mobilePath
    ? process.env.NEXT_PUBLIC_AWS_PATH + '/' + banner?.mobilePath
    : null;

  const bannerImageUrl = bannerDesktop
    ? URL.createObjectURL(bannerDesktop)
    : '';
  const bannerMobileImageUrl = bannerMobile
    ? URL.createObjectURL(bannerMobile)
    : '';
  return (
    <DashboardLayout>
      <Paper withBorder p={20} radius={'md'}>
        <Flex justify={'start'} align={'center'} gap={20}>
          <ActionIcon
            component={Link}
            href={'/admin/banner'}
            radius={'xl'}
            size={'lg'}
            variant="light"
          >
            <IconArrowLeft />
          </ActionIcon>
          <Title order={2}>Banner</Title>
        </Flex>
      </Paper>
      <Space h={'lg'} />
      <Stack>
        <Stack w={'100%'}>
          <InputLabel size="xl">Banner</InputLabel>
          <Paper
            withBorder
            p={20}
            mih={300}
            py={20}
            style={{
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {bannerImage ? (
              <Paper w={400} h={200} shadow="sm" pos={'relative'}>
                <FallbackImage
                  width={400}
                  height={200}
                  radius={'sm'}
                  fit="contain"
                  src={bannerImage}
                  alt="image"
                />
                <ActionIcon
                  onClick={() =>
                    deleteImage({ id: banner?.id as string, type: 'desktop' })
                  }
                  loading={isDeletePending}
                  pos={'absolute'}
                  top={0}
                  color="red"
                  right={0}
                >
                  <IconX />
                </ActionIcon>
              </Paper>
            ) : bannerDesktop ? (
              <Paper w={400} h={200} shadow="sm" pos={'relative'}>
                <FallbackImage
                  width={400}
                  height={225}
                  radius={'sm'}
                  fit="contain"
                  src={bannerImageUrl}
                  onLoad={() => URL.revokeObjectURL(bannerImageUrl)}
                  alt="image"
                />
                <ActionIcon
                  onClick={() => setBannerDesktop(null)}
                  pos={'absolute'}
                  top={0}
                  color="red"
                  right={0}
                >
                  <IconX />
                </ActionIcon>
              </Paper>
            ) : (
              <Dropzone
                accept={IMAGE_MIME_TYPE}
                w={'100%'}
                onDrop={handleSetBannerDesktop}
              >
                <Text ta="center">Upload desktop banner</Text>
              </Dropzone>
            )}
            <Divider orientation="vertical" hidden />
            <Space w={'lg'} />
            {bannerImageMobile ? (
              <Paper w={300} h={200} shadow="sm" pos={'relative'}>
                <FallbackImage
                  width={300}
                  height={200}
                  radius={'sm'}
                  fit="contain"
                  src={bannerImageMobile}
                  alt="image"
                />
                <ActionIcon
                  onClick={() =>
                    deleteImage({ id: banner?.id as string, type: 'mobile' })
                  }
                  loading={isDeletePending}
                  pos={'absolute'}
                  top={0}
                  color="red"
                  right={0}
                >
                  <IconX />
                </ActionIcon>
              </Paper>
            ) : bannerMobile ? (
              <Paper w={300} h={200} shadow="sm" pos={'relative'}>
                <FallbackImage
                  width={300}
                  height={200}
                  radius={'sm'}
                  fit="contain"
                  src={bannerMobileImageUrl}
                  onLoad={() => URL.revokeObjectURL(bannerMobileImageUrl)}
                  alt="image"
                />
                <ActionIcon
                  onClick={() => setBannerMobile(null)}
                  pos={'absolute'}
                  top={0}
                  color="red"
                  right={0}
                >
                  <IconX />
                </ActionIcon>
              </Paper>
            ) : (
              <Dropzone
                accept={IMAGE_MIME_TYPE}
                w={'100%'}
                onDrop={handleSetBannerMobile}
              >
                <Text ta="center">Upload mobile banner</Text>
              </Dropzone>
            )}
          </Paper>
        </Stack>
        <BannerForm
          isPending={isCreateBannerLoading}
          banner={banner as unknown as Banner}
          handleSubmit={handleBannerSubmit}
        />
      </Stack>
    </DashboardLayout>
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

  await helpers.banner.findById.prefetch({ id: id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
};
