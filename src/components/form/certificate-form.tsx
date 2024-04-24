import { useForm } from '@mantine/form';
import crypto from 'crypto';
import QRCode from 'qrcode';
import {
  Button,
  FileInput,
  Grid,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { api } from '@/utils/api';
import { notifications } from '@mantine/notifications';
import { EventCertificatePreview } from '../partner/event/certificate-preview';
import { useState, useEffect } from 'react';
import type { CertificateTemplate } from '@/lib/db/types';
import type { S3ParamType } from '@/lib/types';
import handleImageUpload from '@/lib/hooks/upload-image';

export const CertificateForm = ({
  template,
  eventId,
}: {
  template: CertificateTemplate | undefined;
  eventId: string;
}) => {
  const [qrCode, setQrCode] = useState<string>();
  useEffect(() => {
    QRCode.toDataURL(
      'This is some text',
      {
        width: 400,
        margin: 0,
        color: {
          dark: '#000000',
        },
      },
      (err, url) => {
        if (err) return console.error(err);
        setQrCode(url);
      }
    );
  }, []);

  const [logo, setLogo] = useState<File | null>(null);
  const form = useForm({
    initialValues: {
      description: template?.description ?? '',
      shortDescription: template?.shortDescription ?? '',
      organizationName: template?.organizationName ?? '',
    },
  });

  const context = api.useUtils();
  const { mutate, isLoading: isPending } =
    api.event.updateCertificateTemplate.useMutation({
      onSuccess: res => {
        if (res && logo) {
          const { url, fields } = res.data as unknown as {
            url: string;
            fields: S3ParamType;
          };
          handleImageUpload(url, fields, logo as File);
        }
        context.event.getCertificateTemplate.invalidate({ eventId: eventId });
        notifications.show({
          title: 'Success',
          message: 'Succesfully created certificate template',
        });
      },
    });

  function handleSubmit(values: typeof form.values) {
    const formValues = {
      ...values,
      eventId: eventId,
      imageName: crypto.randomBytes(12).toString('hex') + '.png',
      imageContentType: logo?.type,
    };
    mutate(formValues);
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Grid columns={12}>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Stack w={'100%'}>
            <TextInput
              label="Organization Name"
              {...form.getInputProps('organizationName')}
            />
            <Textarea
              value={template?.description}
              label="Description"
              autosize
              minRows={4}
              maxRows={8}
              {...form.getInputProps('description')}
            />
            <Textarea
              value={template?.shortDescription}
              label="Short Description"
              autosize
              minRows={4}
              maxRows={8}
              {...form.getInputProps('shortDescription')}
            />
            <FileInput
              onChange={setLogo}
              value={logo}
              label="Logo"
              placeholder="Logo to display in certificate"
              accept="image/png"
            />
            <Button
              type="submit"
              loading={isPending}
              disabled={!form.isValid}
              fullWidth
            >
              Submit
            </Button>
          </Stack>
        </Grid.Col>
        <Grid.Col
          span={{ base: 12, lg: 4 }}
          w={'100%'}
          style={{ aspectRatio: '1/1.5' }}
        >
          <EventCertificatePreview
            qrCode={(qrCode as string) ?? ''}
            logo={logo}
            logoUrl={
              process.env.NEXT_PUBLIC_AWS_PATH + '/' + template?.logoPath
            }
            organizationName={form.values.organizationName}
            description={form.values.description}
            shortDescription={form.values.shortDescription}
          />
        </Grid.Col>
      </Grid>
    </form>
  );
};
