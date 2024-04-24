/* eslint-disable unused-imports/no-unused-vars */
import type { UseFormReturnType } from '@mantine/form';
import { useForm, zodResolver } from '@mantine/form';

import type { z } from 'zod';

import { projectSchema } from '@/lib/validation/project-schema';

import { ProjectType } from '@/lib/db/enums';
import type { Contact, Project } from '@/lib/types';
import { api } from '@/utils/api';
import {
  ActionIcon,
  Button,
  InputLabel,
  Paper,
  Space,
  Stack,
  Text,
} from '@mantine/core';
import type { FileWithPath } from '@mantine/dropzone';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconX } from '@tabler/icons-react';
import { FallbackImage } from '../common/fallback-image';
import { FundraisingFormFields } from './fields/fundraising-form-fields';
import { GrantFundraisingFormFields } from './fields/grant-fundraising-form-fields';
import { FormStep } from './form-stepper';

const ProjectForm = ({
  data,
  type,
  isLoading,
  handleSubmit,
  setFiles,
  files,
  handleSetFiles,
}: {
  data: Project | undefined;
  type: ProjectType;
  isLoading: boolean;
  handleSubmit: (values: z.infer<typeof projectSchema>) => void;
  setFiles: (files: File[]) => void;
  files: File[];
  handleSetFiles: (images: FileWithPath[]) => void;
}) => {
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      title: data?.title || '',
      link: data?.link || '',
      description: data?.description || '',
      startTime: (data?.startTime as unknown as Date) ?? new Date(),
      endTime: (data?.endTime as unknown as Date) ?? new Date(),
      goalAmount: data?.goalAmount || 0,
      currentAmount: data?.currentAmount || 0,
      contact: {
        phone: (data?.contact as Contact)?.phone ?? '',
        email: (data?.contact as Contact)?.email ?? '',
      },
    },
    validate: zodResolver(projectSchema),
  });

  const mainImage = data?.Images?.find(i => i.type === 'main');

  const context = api.useContext();
  const { mutate: deleteImage } = api.project.deleteImage.useMutation({
    onSuccess: () => {
      context.project.findBySlug.invalidate({
        slug: data?.slug as unknown as string,
      });
    },
  });

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      {type === ProjectType.FUNDRAISING ? (
        <FundraisingFormFields
          form={
            form as unknown as UseFormReturnType<z.infer<typeof projectSchema>>
          }
          data={data}
        />
      ) : (
        <GrantFundraisingFormFields
          form={
            form as unknown as UseFormReturnType<z.infer<typeof projectSchema>>
          }
          data={data}
        />
      )}
      <Space h={'lg'} />
      <div className="flex gap-4">
        <FormStep line step={3} />
        <Stack w={'100%'}>
          <InputLabel size="xl">Images</InputLabel>
          <Paper
            withBorder
            radius={'xl'}
            p={20}
            mih={300}
            py={20}
            style={{
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {mainImage ? (
              <Paper w={400} h={300} shadow="sm" pos={'relative'}>
                <FallbackImage
                  height={300}
                  width={400}
                  radius={'md'}
                  fit="cover"
                  src={process.env.NEXT_PUBLIC_AWS_PATH + '/' + mainImage.path}
                  onLoad={() =>
                    URL.revokeObjectURL(
                      process.env.NEXT_PUBLIC_AWS_PATH + '/' + mainImage.path
                    )
                  }
                  alt="image"
                />
                <ActionIcon
                  onClick={() =>
                    deleteImage({ id: mainImage?.id as unknown as string })
                  }
                  pos={'absolute'}
                  top={0}
                  color="red"
                  right={0}
                >
                  <IconX />
                </ActionIcon>
              </Paper>
            ) : files.length > 0 ? (
              files.map((file, i) => {
                const imageUrl = URL.createObjectURL(file);
                return (
                  <Paper w={400} h={300} shadow="sm" key={i} pos={'relative'}>
                    <FallbackImage
                      width={400}
                      height={300}
                      radius={'md'}
                      fit="cover"
                      src={imageUrl}
                      onLoad={() => URL.revokeObjectURL(imageUrl)}
                      alt="image"
                    />
                    <ActionIcon
                      onClick={() => setFiles([])}
                      pos={'absolute'}
                      top={0}
                      color="red"
                      right={0}
                    >
                      <IconX />
                    </ActionIcon>
                  </Paper>
                );
              })
            ) : (
              // </Paperdd>
              <Dropzone
                accept={IMAGE_MIME_TYPE}
                w={'100%'}
                onDrop={handleSetFiles}
              >
                <Text ta="center">Drop images here</Text>
              </Dropzone>
            )}
          </Paper>
        </Stack>
      </div>

      <div className="flex gap-4">
        <FormStep step={7} />
        <Stack w={'100%'}>
          <InputLabel size="xl">Check</InputLabel>
          <Paper withBorder p={20} radius={'xl'} py={30}>
            <Text fz="18" c={'dimmed'}>
              ОРУУЛСАН МЭДЭЭЛЛҮҮДЭЭ ШАЛГААРАЙ. БҮХ ХЭСГИЙГ ЗӨВ БӨГЛӨСӨН
              ТОХИОЛДОЛД ХҮЛЭЭЛГИЙН ГОРИМД ОРЖ НИЙТЛЭГДЭНЭ.
            </Text>
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                loading={isLoading}
                disabled={!form.isValid}
              >
                Submit
              </Button>
              <Button>Cancel</Button>
            </div>
          </Paper>
        </Stack>
      </div>
    </form>
  );
};

export default ProjectForm;
