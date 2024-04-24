import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import EventForm from '@/components/form/event-form';
import PartnerLayout from '@/components/layout/partner-layout';
import { EventType } from '@/lib/db/enums';
import handleImageUpload from '@/lib/hooks/upload-image';
import type { S3ParamType } from '@/lib/types';
import imageResizer from '@/lib/utils/image-resizer';
import type { eventSchema } from '@/lib/validation/event-schema';
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
import type { z } from 'zod';

const EditEvent = () => {
  const router = useRouter();

  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [eventSlug, setEventSlug] = useState('');

  async function handleSetFiles(images: FileWithPath[]) {
    const resizedFiles = await Promise.all(
      images.map(async file => {
        const resizedFile = await imageResizer(file, 300, 300);
        return resizedFile;
      })
    );
    setFiles(resizedFiles as unknown as File[]);
  }

  useEffect(() => {
    if (router.query.slug) {
      setEventSlug(router.query.slug as string);
    }
  }, [router.isReady]);

  const context = api.useContext();
  const { data, isLoading } = api.event.findBySlug.useQuery({
    slug: eventSlug,
  });

  const { mutate: createPresignedUrl } =
    api.event.createPresignedUrl.useMutation({
      onSuccess: res => {
        const { url, fields } = res.data as unknown as {
          url: string;
          fields: S3ParamType;
        };
        const file = files.find(f => f.name === res.fileName);
        handleImageUpload(url, fields, file as File);
      },
    });
  const { mutate, isLoading: isPending } = api.event.update.useMutation({
    onSuccess: newEvent => {
      if (files.length > 0) {
        files.map(file => {
          createPresignedUrl({
            eventId: newEvent.id,
            name: file?.name as string,
            type: 'main',
            contentType: file?.type as string,
          });
        });
      }
      context.event.findBySlug.invalidate({ slug: newEvent.slug });
      notifications.show({
        title: 'Success',
        message: 'Successfully updated event',
      });

      router.push(`/p/events/${newEvent.slug}`);
    },
  });

  function handleSubmit(values: z.infer<typeof eventSchema>) {
    const formValues = { ...values, id: data?.id as unknown as string };
    mutate(formValues);
  }

  return (
    <PartnerLayout>
      <Container fluid p={'xl'}>
        <Paper withBorder p={20} radius={'md'}>
          <Flex justify={'start'} align={'center'} gap={20}>
            <ActionIcon
              component={Link}
              href={`/p/manage/event/${data?.id}`}
              radius={'xl'}
              size={'lg'}
              variant="light"
            >
              <IconArrowLeft />
            </ActionIcon>
            <Title order={2}>
              {(data?.type as unknown as EventType) === EventType.EVENT
                ? 'Event project'
                : 'Volunteering event'}
            </Title>
          </Flex>
        </Paper>
        <Space h="lg" />
        {!isLoading && data ? (
          <EventForm
            type={data.type as unknown as EventType}
            data={data}
            isLoading={isPending}
            handleSubmit={handleSubmit}
            setFiles={setFiles}
            handleSetFiles={handleSetFiles}
            files={files}
          />
        ) : (
          <LoadingOverlay visible />
        )}
      </Container>
    </PartnerLayout>
  );
};

export default EditEvent;
