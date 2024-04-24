import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import type { z } from 'zod';

import ProjectForm from '@/components/form/project-form';
import PartnerLayout from '@/components/layout/partner-layout';
import { ProjectType } from '@/lib/db/enums';
import handleImageUpload from '@/lib/hooks/upload-image';
import type { Project, S3ParamType } from '@/lib/types';
import imageResizer from '@/lib/utils/image-resizer';
import type { projectSchema } from '@/lib/validation/project-schema';
import { api } from '@/utils/api';
import {
  ActionIcon,
  Container,
  Flex,
  LoadingOverlay,
  Paper,
  Space,
  Title,
} from '@mantine/core';
import type { FileWithPath } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';

const EditProject = () => {
  const router = useRouter();
  const [projectId, setFundId] = useState('');
  const [files, setFiles] = useState<FileWithPath[]>([]);

  async function handleSetFiles(images: FileWithPath[]) {
    const resizedFiles = await Promise.all(
      images.map(async file => {
        const resizedFile = await imageResizer(file, 800, 600);
        return resizedFile;
      })
    );
    setFiles(resizedFiles as unknown as File[]);
  }

  useEffect(() => {
    if (router.isReady) {
      setFundId(router.query.slug as string);
    }
  }, [router.isReady]);

  const context = api.useContext();
  const { data, isLoading } = api.project.findBySlug.useQuery({
    slug: projectId,
  });

  const { mutate: createPresignedUrl } =
    api.project.createPresignedUrl.useMutation({
      onSuccess: res => {
        const { url, fields } = res?.data as unknown as {
          url: string;
          fields: S3ParamType;
        };
        const file = files.find(f => f.name === res.fileName);
        handleImageUpload(url, fields, file as File);
      },
    });
  const { mutate, isLoading: isPending } = api.project.update.useMutation({
    onSuccess: newProject => {
      if (files.length > 0) {
        files.map(file => {
          createPresignedUrl({
            projectId: newProject.id,
            name: file?.name as string,
            type: 'main',
            contentType: file?.type as string,
          });
        });
      }
      context.project.findBySlug.invalidate({ slug: newProject.slug });
      notifications.show({
        title: 'Success',
        message: 'Successfully updated fund',
      });
      router.push(`/p/projects/${newProject.id}`);
    },
  });
  function handleSubmit(values: z.infer<typeof projectSchema>) {
    const formValues = { ...values, id: projectId };
    mutate(formValues);
  }

  return (
    <PartnerLayout>
      <Container fluid p={'xl'}>
        <Paper withBorder p={20} radius={'md'}>
          <Flex justify={'start'} align={'center'} gap={20}>
            <ActionIcon
              component={Link}
              href={`/p/projects/${data?.id}`}
              radius={'xl'}
              size={'lg'}
              variant="light"
            >
              <IconArrowLeft />
            </ActionIcon>
            <Title order={2}>
              {data?.type === ProjectType.FUNDRAISING
                ? 'Fundraising'
                : 'Grant fundraising'}
            </Title>
          </Flex>
        </Paper>
        <Space h={'lg'} />
        {!isLoading && data ? (
          <ProjectForm
            type={data.type as ProjectType}
            data={data as unknown as Project | undefined}
            handleSubmit={handleSubmit}
            isLoading={isPending}
            setFiles={setFiles}
            files={files}
            handleSetFiles={handleSetFiles}
          />
        ) : (
          <LoadingOverlay />
        )}
      </Container>
    </PartnerLayout>
  );
};

export default EditProject;
