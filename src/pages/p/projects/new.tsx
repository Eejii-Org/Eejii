import ProjectForm from '@/components/form/project-form';
import PartnerLayout from '@/components/layout/partner-layout';
import { ProjectType } from '@/lib/db/enums';
import handleImageUpload from '@/lib/hooks/upload-image';
import type { S3ParamType } from '@/lib/types';
import imageResizer from '@/lib/utils/image-resizer';
import type { projectSchema } from '@/lib/validation/project-schema';
import tabsClasses from '@/styles/Tabs.module.css';
import { api } from '@/utils/api';
import {
  ActionIcon,
  Container,
  Flex,
  Paper,
  Space,
  Tabs,
  Title,
} from '@mantine/core';
import type { FileWithPath } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import type { z } from 'zod';

const NewProject = ({ type }: { type: ProjectType }) => {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);

  async function handleSetFiles(images: FileWithPath[]) {
    const resizedFiles = await Promise.all(
      images.map(async file => {
        const resizedFile = await imageResizer(file, 800, 600);
        return resizedFile;
      })
    );
    setFiles(resizedFiles as unknown as File[]);
  }

  const { mutate: createPresignedUrl } =
    api.project.createPresignedUrl.useMutation({
      onSuccess: res => {
        const { url, fields } = res.data as unknown as {
          url: string;
          fields: S3ParamType;
        };
        const file = files.find(f => f.name === res.fileName);
        handleImageUpload(url, fields, file as File);
      },
    });
  const { mutate, isLoading } = api.project.create.useMutation({
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
      notifications.show({
        title: 'Success',
        message: 'Successfully created project',
      });
      router.push(`/p/projects/${newProject.id}`);
    },
  });
  function handleSubmit(values: z.infer<typeof projectSchema>) {
    const formValues = { ...values, type: type };
    mutate(formValues);
  }
  return (
    <ProjectForm
      type={type}
      data={undefined}
      handleSubmit={handleSubmit}
      setFiles={setFiles}
      handleSetFiles={handleSetFiles}
      isLoading={isLoading}
      files={files}
    />
  );
};

export default function New() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <PartnerLayout>
      <Container fluid p={'xl'}>
        <Tabs
          defaultValue="project"
          classNames={{
            list: tabsClasses.list,
            tab: tabsClasses.tab,
          }}
        >
          <Tabs.List defaultValue={'project'}>
            <Tabs.Tab value="project" onClick={() => setActiveIndex(0)}>
              Project
            </Tabs.Tab>
            <Tabs.Tab value="grant_project" onClick={() => setActiveIndex(1)}>
              Grant project
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
        <Space h={'lg'} />
        <Paper withBorder p={20} radius={'md'}>
          <Flex justify={'start'} align={'center'} gap={20}>
            <ActionIcon
              component={Link}
              href={'/p/projects'}
              radius={'xl'}
              size={'lg'}
              variant="light"
            >
              <IconArrowLeft />
            </ActionIcon>
            <Title order={2}>
              {activeIndex == 0 && 'Project'}
              {activeIndex == 1 && 'Grant project'}
            </Title>
          </Flex>
        </Paper>
        <Space h={'lg'} />
        {activeIndex == 0 && <NewProject type={ProjectType.FUNDRAISING} />}
        {activeIndex == 1 && (
          <NewProject type={ProjectType.GRANT_FUNDRAISING} />
        )}
      </Container>
    </PartnerLayout>
  );
}
