/* eslint-disable unused-imports/no-unused-vars */
import type { UseFormReturnType } from '@mantine/form';
import { useForm, zodResolver } from '@mantine/form';
import type { z } from 'zod';

import type { Contact, Event } from '@/lib/types';
import { eventSchema } from '@/lib/validation/event-schema';
import { api } from '@/utils/api';

import { EventType } from '@/lib/db/enums';
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
import { EventFormFields } from './fields/event-form-fields';
import { VolunteeringEventFormFields } from './fields/volunteering-event-form-fields';
import { FormStep } from './form-stepper';

const EventForm = ({
  data,
  type,
  isLoading,
  handleSubmit,
  setFiles,
  files,
  handleSetFiles,
}: {
  data: Event | undefined;
  type: EventType;
  isLoading: boolean;
  handleSubmit: (values: z.infer<typeof eventSchema>) => void;
  setFiles: (files: File[]) => void;
  files: File[];
  handleSetFiles: (images: FileWithPath[]) => void;
}) => {
  const eventCategories = data?.Categories?.map(c => c.categoryId) ?? [''];
  const eventCollaborators = data?.Collaborators?.map(
    ec => ec.id as unknown as string
  ) ?? [''];
  const eventRoles = data?.Roles?.map(r => {
    return {
      name: r.name,
      slots: r.slots,
    };
  }) ?? [{ name: '', slots: 0 }];

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      title: data?.title ?? '',
      description: data?.description ?? '',
      location: data?.location ?? '',
      startTime: (data?.startTime as unknown as Date) ?? new Date(),
      endTime: (data?.endTime as unknown as Date) ?? new Date(),
      categories: eventCategories,
      collaborators: eventCollaborators,
      maxVolunteers: data?.maxVolunteers ?? 0,
      volunteeringHours: data?.volunteeringHours ?? 0,
      contact: {
        phone: (data?.contact as Contact)?.phone ?? '',
        email: (data?.contact as Contact)?.email ?? '',
      },
      roles: eventRoles,
    },
    validate: zodResolver(eventSchema),
  });

  const mainImage = data?.Images?.find(i => i.type === 'main');

  console.log(form.values.roles);
  const context = api.useUtils();
  const { mutate: deleteImage } = api.event.deleteImage.useMutation({
    onSuccess: () => {
      context.event.findBySlug.invalidate({
        slug: data?.slug as unknown as string,
      });
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(values =>
        handleSubmit(values as z.infer<typeof eventSchema>)
      )}
    >
      {type === EventType.EVENT ? (
        <EventFormFields
          data={data}
          form={
            form as unknown as UseFormReturnType<z.infer<typeof eventSchema>>
          }
        />
      ) : (
        <VolunteeringEventFormFields
          data={data}
          form={
            form as unknown as UseFormReturnType<z.infer<typeof eventSchema>>
          }
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
                    deleteImage({ id: mainImage.id as unknown as string })
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
                  <Paper key={i} pos={'relative'}>
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
              <Dropzone
                accept={IMAGE_MIME_TYPE}
                h={100}
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
                disabled={!form.isValid}
                loading={isLoading}
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

export default EventForm;
