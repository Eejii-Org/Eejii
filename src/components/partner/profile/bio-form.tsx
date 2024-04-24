import handleImageUpload from '@/lib/hooks/upload-image';
import type { User } from '@/lib/types';
import { inputStyle } from '@/styles/inputStyle';
import { notifications } from '@mantine/notifications';

import imageResizer from '@/lib/utils/image-resizer';
import { api } from '@/utils/api';
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Image,
  Paper,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import type { FileWithPath } from '@mantine/dropzone';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useForm, zodResolver } from '@mantine/form';
import { IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { bioSchema } from '@/lib/validation/mutation-schema/partner/bio-schema';
import { SelectCountryField } from '@/components/form/fields/select-country-field';
import { SelectStateField } from '@/components/form/fields/select-state-field';
import { SelectCityField } from '@/components/form/fields/select-city-field';

export const BioForm = ({ user }: { user: User }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>(
    (user?.Addresses?.[0]?.countryCode as string) ?? 'MN'
  );
  const [selectedState, setSelectedState] = useState<string>(
    user?.Addresses?.[0]?.provinceName ?? '047'
  );

  const form = useForm({
    initialValues: {
      address: {
        countryCode: user?.Addresses?.[0]?.countryCode ?? '',
        provinceName: user?.Addresses?.[0]?.provinceName ?? '',
        city: user?.Addresses?.[0]?.city ?? '',
        district: user?.Addresses?.[0]?.district ?? '',
        street: user?.Addresses?.[0]?.street ?? '',
      },
      organizationName: user.organizationName ?? '',
      bio: user.bio ?? '',
      addressId: (user?.Addresses?.[0]?.id as unknown as string) ?? '',
    },
    validateInputOnChange: true,
    validate: zodResolver(bioSchema),
  });

  const profileImage = user?.Images?.find(i => i.type === 'profile');

  async function handleSetFiles(images: FileWithPath[]) {
    const resizedFiles = await Promise.all(
      images.map(async file => {
        const resizedFile = await imageResizer(file, 300, 300);
        return resizedFile;
      })
    );
    setFiles(resizedFiles as unknown as File[]);
  }

  const context = api.useContext();
  const { mutate: createPresignedUrl } =
    api.partner.createPresignedUrl.useMutation({
      onSuccess: async res => {
        const { url, fields } = res?.data as any;
        const file = files.find(f => f.name === res.fileName);
        handleImageUpload(url, fields, file as File);
      },
    });
  const { mutate, isLoading } = api.partner.updateBio.useMutation({
    onError: async error => {
      notifications.show({
        title: 'Error',
        color: 'red',
        message: error.message,
      });
    },
    onSuccess: async resUser => {
      if (files.length > 0) {
        files.map(file => {
          createPresignedUrl({
            userId: resUser.id,
            name: file?.name as string,
            type: 'profile',
            contentType: file?.type as string,
          });
        });
      }
      context.user.getMe.invalidate();
      notifications.show({
        title: 'Success',
        message: 'Successfully updated bio',
      });
    },
  });

  const { mutate: deleteImage } = api.user.deleteImage.useMutation({
    onSuccess: () => {
      context.user.getMe.invalidate();
    },
  });

  function handleSubmit(values: typeof form.values) {
    mutate(values);
  }

  return (
    <Paper withBorder p={40} radius={'lg'}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Flex justify={'space-between'} gap={40}>
          <Stack w={'100%'}>
            <Title order={3}>Bio</Title>
            <TextInput
              {...form.getInputProps('organizationName')}
              placeholder="Name"
              description="Your name here"
              inputWrapperOrder={['label', 'error', 'input', 'description']}
              styles={inputStyle}
            />
            <TextInput
              {...form.getInputProps('bio')}
              placeholder="Bio"
              description="here"
              inputWrapperOrder={['label', 'error', 'input', 'description']}
              styles={inputStyle}
            />
            <Box>
              <Title order={4}>Хаяг</Title>
              <Flex mt="md" gap={'md'} align={'center'}>
                <SelectCountryField
                  defaultValue={form.getInputProps('address.countryCode').value}
                  handleChange={v => {
                    form.getInputProps('address.countryCode').onChange(v);
                    setSelectedCountry(v);
                  }}
                />
                <SelectStateField
                  country={selectedCountry}
                  defaultValue={
                    form.getInputProps('address.provinceName').value
                  }
                  handleChange={v => {
                    form.getInputProps('address.provinceName').onChange(v);
                    setSelectedState(v);
                  }}
                />
                <SelectCityField
                  country={selectedCountry}
                  state={selectedState}
                  defaultValue={form.getInputProps('address.city').value}
                  handleChange={form.getInputProps('address.city').onChange}
                />
              </Flex>
              <Flex mt="md" gap={'md'} align={'center'}>
                <TextInput
                  mt={'md'}
                  {...form.getInputProps('address.district')}
                  label="Дүүрэг, сум"
                  w={'100%'}
                  radius={'xl'}
                  placeholder="Дүүрэг, сум"
                />
                <TextInput
                  mt={'md'}
                  w={'100%'}
                  {...form.getInputProps('address.street')}
                  label="Гудамж (optional)"
                  radius={'xl'}
                  placeholder="Гудамж"
                />
              </Flex>
            </Box>
          </Stack>
          <Stack>
            <div>
              <Text>Picture</Text>
              <Text c={'dimmed'} fz={12}>
                Upload profile pic
              </Text>
            </div>
            {profileImage ? (
              <Paper pos={'relative'}>
                <Image
                  height={200}
                  width={320}
                  radius={'md'}
                  fit="contain"
                  src={
                    process.env.NEXT_PUBLIC_AWS_PATH + '/' + profileImage.path
                  }
                  onLoad={() =>
                    URL.revokeObjectURL(
                      process.env.NEXT_PUBLIC_AWS_PATH + '/' + profileImage.path
                    )
                  }
                  alt="image"
                />
                <ActionIcon
                  onClick={() =>
                    deleteImage({ id: profileImage.id as unknown as string })
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
              <Paper>
                {files.map((file, i) => {
                  const imageUrl = URL.createObjectURL(file);
                  return (
                    <Paper key={i} pos={'relative'}>
                      <Image
                        height={200}
                        width={320}
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
                onReject={e => alert(e?.[0]?.errors?.[0]?.message)}
                h={200}
                w={320}
                onDrop={handleSetFiles}
              >
                <Text ta="center">Drop images here</Text>
              </Dropzone>
            )}
          </Stack>
        </Flex>
        <Space h={'lg'} />
        <Flex justify={'end'}>
          <Button
            radius={'xl'}
            type="submit"
            disabled={isLoading || !form.isValid}
            loading={isLoading}
          >
            Submit
          </Button>
        </Flex>
      </form>
    </Paper>
  );
};
