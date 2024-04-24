import { FormStep } from '@/components/form/form-stepper';
import type { Media } from '@/lib/types';
import { mediaCreateSchema } from '@/lib/validation/media-schema';
import { inputStyle } from '@/styles/inputStyle';
import { api } from '@/utils/api';
import {
  ActionIcon,
  Button,
  Chip,
  Flex,
  Group,
  Image,
  InputLabel,
  Paper,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import type { FileWithPath } from '@mantine/dropzone';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { useState } from 'react';
import type { z } from 'zod';

export const MediaForm = ({
  media,
  files,
  handleSubmit,
  handleSetFiles,
  setFiles,
  isPending,
}: {
  media: Media | null;
  files: File[];
  handleSubmit: (values: z.infer<typeof mediaCreateSchema>) => void;
  handleSetFiles: (files: FileWithPath[]) => void;
  setFiles: (files: FileWithPath[]) => void;
  isPending: boolean;
}) => {
  const { data: categories, isLoading: isCategoryLoading } =
    api.category.findAll.useQuery({ type: 'media' });

  const mediaCategories = media?.Categories?.map(
    c => c.categoryId as string
  ) ?? [''];
  const image = media?.Images.find(i => i.type === 'main');

  const form = useForm({
    validateInputOnChange: true,
    validate: zodResolver(mediaCreateSchema),
    initialValues: {
      title: media?.title ?? '',
      body: media?.body ?? '',
      categories: mediaCategories,
    },
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  function handleSelectCategory(values: string[]) {
    setSelectedCategories(values);
    form.setFieldValue('categories', values);
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <div className="space-y-4">
        <div className="flex gap-4">
          <FormStep step={1} line />
          <Stack w={'100%'}>
            <InputLabel size="xl">Title</InputLabel>
            <Paper withBorder p={20} radius={'xl'} py={30}>
              <TextInput
                {...form.getInputProps('title')}
                placeholder="Title"
                w={'100%'}
                size="lg"
                description="DESC here"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                styles={inputStyle}
              />
            </Paper>
          </Stack>
        </div>
        <div className="flex gap-4">
          <FormStep line step={6} />
          <Stack w={'100%'}>
            <InputLabel size="xl">Body</InputLabel>
            <Paper withBorder p={20} radius={'xl'} py={30}>
              <Textarea
                {...form.getInputProps('body')}
                placeholder="Write description"
                w={'100%'}
                size="md"
              />
            </Paper>
          </Stack>
        </div>
        <div className="flex gap-4">
          <FormStep line step={3} />
          <Stack w={'100%'}>
            <InputLabel size="xl">Images</InputLabel>
            {image ? (
              <Paper pos={'relative'} mah={300} maw={400}>
                <Image
                  height={200}
                  width={320}
                  radius={'md'}
                  fit="contain"
                  src={process.env.NEXT_PUBLIC_AWS_PATH + '/' + image.path}
                  onLoad={() =>
                    URL.revokeObjectURL(
                      process.env.NEXT_PUBLIC_AWS_PATH + '/' + image.path
                    )
                  }
                  alt="image"
                />
                <ActionIcon
                  // onClick={}
                  pos={'absolute'}
                  top={0}
                  color="red"
                  right={0}
                >
                  <IconX />
                </ActionIcon>
              </Paper>
            ) : files.length > 0 ? (
              <Paper>
                {files.map((file, i) => {
                  const imageUrl = URL.createObjectURL(file);
                  return (
                    <Paper h={200} w={320} key={i} pos={'relative'}>
                      <Image
                        radius={'md'}
                        fit="contain"
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
                })}
              </Paper>
            ) : (
              <Dropzone
                accept={IMAGE_MIME_TYPE}
                maxFiles={1}
                maxSize={1024 ** 2}
                h={200}
                w={320}
                onReject={() => {
                  notifications.show({
                    title: 'Warning',
                    message: 'File too larg',
                    color: 'red',
                  });
                }}
                onDrop={handleSetFiles}
              >
                <Text ta="center">Drop images here</Text>
              </Dropzone>
            )}
          </Stack>
        </div>
        <div className="flex gap-4">
          <FormStep line step={3} />
          <Stack w={'100%'}>
            <InputLabel size="xl">Category</InputLabel>
            <Paper withBorder p={20} radius={'xl'} py={30}>
              {!isCategoryLoading && categories ? (
                <Chip.Group
                  multiple
                  value={selectedCategories}
                  onChange={handleSelectCategory}
                >
                  <Group justify="center" mt="md">
                    {categories.map(c => (
                      <Chip value={c.id} key={c.id}>
                        {c.name}
                      </Chip>
                    ))}
                  </Group>
                </Chip.Group>
              ) : (
                <Flex gap={10}>
                  <Skeleton h={30} w={90} radius="xl" />
                  <Skeleton h={30} w={110} radius={'xl'} />
                  <Skeleton h={30} w={70} radius={'xl'} />
                  <Skeleton h={30} w={90} radius={'xl'} />
                </Flex>
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
                  disabled={!form.isValid}
                  loading={isPending}
                >
                  Submit
                </Button>
                <Button>Cancel</Button>
              </div>
            </Paper>
          </Stack>
        </div>
      </div>
    </form>
  );
};
