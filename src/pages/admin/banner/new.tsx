import { BannerForm } from '@/components/admin/form/banner-form';
import { BannerPositionForm } from '@/components/admin/form/banner-position-form';
import { FallbackImage } from '@/components/common/fallback-image';
import DashboardLayout from '@/components/layout/dashboard-layout';
import handleImageUpload from '@/lib/hooks/upload-image';
import type { S3ParamType } from '@/lib/types';
import imageResizer from '@/lib/utils/image-resizer';
import { api } from '@/utils/api';
import {
  ActionIcon,
  Divider,
  Flex,
  InputLabel,
  Paper,
  SegmentedControl,
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
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

type PositionFormValuesType = {
  code: string;
  label: string;
};
type BannerFormValuesType = {
  title: string | null;
  link: string | null;
  description: string | null;
  positionCode: string;
};

export default function New() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string | null>('Banner');
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

  const { mutate: createPosition, isLoading: isCreatePositionLoading } =
    api.banner.createPosition.useMutation({
      onSuccess: () => {
        notifications.show({
          title: 'Success',
          message: 'Successfully added position',
        });
        router.push('/admin/banner');
      },
    });

  const { mutate: createBanner, isLoading: isCreateBannerLoading } =
    api.banner.createBanner.useMutation({
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
          message: 'Successfully added banner',
        });
        router.push('/admin/banner');
      },
    });

  function handleBannerSubmit(bannerValues: BannerFormValuesType) {
    const bannerFormValues = {
      ...bannerValues,
      contentType: bannerDesktop?.type as string,
      name: bannerDesktop?.name as string,
      contentTypeMobile: bannerMobile?.type as string,
      nameMobile: bannerMobile?.name as string,
    };
    createBanner(bannerFormValues);
  }
  function handlePositionSubmit(bannerPositionValues: PositionFormValuesType) {
    createPosition(bannerPositionValues);
  }

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
      <SegmentedControl
        fullWidth
        miw={400}
        value={activeTab as string}
        onChange={setActiveTab}
        data={['Banner', 'Position']}
      />
      <Space h={'lg'} />
      {activeTab === 'Banner' ? (
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
              {bannerDesktop ? (
                <Paper w={400} h={225} shadow="sm" pos={'relative'}>
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
              {bannerMobile ? (
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
            banner={undefined}
            handleSubmit={handleBannerSubmit}
          />
        </Stack>
      ) : (
        <BannerPositionForm
          isPending={isCreatePositionLoading}
          position={undefined}
          handleSubmit={handlePositionSubmit}
        />
      )}
    </DashboardLayout>
  );
}
