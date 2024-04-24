import EventForm from '@/components/form/event-form';
import PartnerLayout from '@/components/layout/partner-layout';
import { EventType } from '@/lib/db/enums';
import handleImageUpload from '@/lib/hooks/upload-image';
import type { S3ParamType } from '@/lib/types';
import imageResizer from '@/lib/utils/image-resizer';
import type { eventSchema } from '@/lib/validation/event-schema';
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

const NewEvent = ({ type }: { type: EventType }) => {
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
    api.event.createPresignedUrl.useMutation({
      onError: err => {
        notifications.show({
          title: 'Error',
          message: err.message,
          color: 're',
        });
      },
      onSuccess: res => {
        const { url, fields } = res.data as unknown as {
          url: string;
          fields: S3ParamType;
        };
        const file = files.find(f => f.name === res.fileName);
        handleImageUpload(url, fields, file as File);
      },
    });
  const { mutate, isLoading } = api.event.create.useMutation({
    onSuccess: newEvent => {
      if (files.length > 0) {
        files.map(file => {
          createPresignedUrl({
            eventId: newEvent.id,
            type: 'main',
            name: file?.name as string,
            contentType: file?.type as string,
          });
        });
      }

      notifications.show({
        title: 'Success',
        message: 'Successfully created event',
      });
      router.push(`/p/events/${newEvent.slug}`);
    },
  });

  function handleSubmit(values: z.infer<typeof eventSchema>) {
    const formValues = { ...values, type: type };
    mutate(formValues);
  }
  return (
    <EventForm
      type={type}
      data={undefined}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      handleSetFiles={handleSetFiles}
      setFiles={setFiles}
      files={files}
    />
  );
};

export default function New() {
  const [activeIndex, setActiveIndex] = useState<string | null>('event');

  return (
    <PartnerLayout>
      <Container fluid p={'xl'}>
        <Tabs
          value={activeIndex}
          onChange={setActiveIndex}
          classNames={{
            list: tabsClasses.list,
            tab: tabsClasses.tab,
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="event">Event</Tabs.Tab>
            <Tabs.Tab value="volunteering_event">Volunteering Event</Tabs.Tab>
          </Tabs.List>
        </Tabs>
        <Space h={'lg'} />
        <Paper withBorder p={20} radius={'md'}>
          <Flex justify={'start'} align={'center'} gap={20}>
            <ActionIcon
              component={Link}
              href={'/p/events'}
              radius={'xl'}
              size={'lg'}
              variant="light"
            >
              <IconArrowLeft />
            </ActionIcon>
            <Title order={2}>
              {activeIndex == 'event' && 'Event'}
              {activeIndex == 'volunteering_event' && 'Volunteering event'}
            </Title>
          </Flex>
        </Paper>
        <Space h={'lg'} />
        {activeIndex == 'event' && <NewEvent type={EventType.EVENT} />}
        {activeIndex == 'volunteering_event' && (
          <NewEvent type={EventType.VOLUNTEERING} />
        )}
      </Container>
    </PartnerLayout>
  );
}
