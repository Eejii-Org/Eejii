import PartnerLayout from '@/components/layout/partner-layout';
import { MediaForm } from '@/components/partner/media/media-form';
import handleImageUpload from '@/lib/hooks/upload-image';
import type { S3ParamType } from '@/lib/types';
import imageResizer from '@/lib/utils/image-resizer';
import type { mediaCreateSchema } from '@/lib/validation/media-schema';
import { api } from '@/utils/api';
import { Container } from '@mantine/core';
import type { FileWithPath } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { useState } from 'react';
import type { z } from 'zod';

export default function NewMedia() {
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

  const { mutate: create, isLoading: isCreateLoading } =
    api.media.createMedia.useMutation({
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
    create(values);
  }

  return (
    <PartnerLayout>
      <Container fluid p={'xl'}>
        <MediaForm
          handleSubmit={handleSubmit}
          handleSetFiles={handleSetFiles}
          media={null}
          files={files}
          setFiles={setFiles}
          isPending={isCreateLoading}
        />
      </Container>
    </PartnerLayout>
  );
}
