import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  SimpleGrid,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { DateInput } from '@mantine/dates';
import dynamic from 'next/dynamic';
import { useForm, zodResolver } from '@mantine/form';
import type { User } from '@/lib/types';
import { api } from '@/utils/api';
import { notifications } from '@mantine/notifications';
import { updateInfoSchema } from '@/lib/validation/mutation-schema/volunteer/updateInfo-schema';
import { SelectCountryField } from '@/components/form/fields/select-country-field';
import { SelectStateField } from '@/components/form/fields/select-state-field';
import { SelectCityField } from '@/components/form/fields/select-city-field';
import { useState } from 'react';
const Select = dynamic(() => import('@mantine/core').then(el => el.Select), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});
export const InfoForm = ({ volunteer }: { volunteer: User }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>(
    (volunteer?.Addresses[0]?.countryCode as string) ?? 'MN'
  );
  const [selectedState, setSelectedState] = useState<string>(
    volunteer?.Addresses[0]?.provinceName ?? '047'
  );

  const context = api.useUtils();
  const { mutate, isLoading } = api.volunteer.updateInfo.useMutation({
    onSuccess: () => {
      context.volunteer.findById.invalidate({
        id: volunteer.id as unknown as string,
      });
      notifications.show({
        title: 'Successfully',
        message: 'Successfully updated info',
      });
    },
  });
  const form = useForm({
    initialValues: {
      firstName: volunteer.firstName,
      lastName: volunteer.lastName,
      email: volunteer.email,
      username: volunteer.username,
      userId: volunteer.id,
      gender: volunteer.gender,
      birthDate: volunteer.birthDate,
      address: {
        countryCode: volunteer?.Addresses[0]?.countryCode ?? '',
        provinceName: volunteer?.Addresses[0]?.provinceName ?? '',
        city: volunteer?.Addresses[0]?.city ?? '',
        district: volunteer?.Addresses[0]?.district ?? '',
        street: volunteer?.Addresses[0]?.street ?? '',
      },
    },
    validate: zodResolver(updateInfoSchema),
    validateInputOnChange: true,
  });
  function handleSubmit(values: typeof form.values) {
    const formValues = {
      ...values,
      birthDate: new Date(values.birthDate as unknown as string),
      userId: volunteer.id as unknown as string,
    };
    mutate(formValues);
  }
  console.log(volunteer.id);
  console.log(form.values);
  console.log(form.errors);
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <input
        type="hidden"
        value={volunteer.id as unknown as string}
        {...form.getInputProps('userId')}
      />
      <Stack>
        <Title order={4}>Хувийн мэдээлэл</Title>
        <Flex align={'center'} justify={'start'} gap={'lg'}>
          <Avatar size={150} />
          <Button variant="outline" radius={'lg'} color="gray">
            Update
          </Button>
          <Button
            color="gray"
            leftSection={<IconTrash />}
            variant="transparent"
          >
            Remove
          </Button>
        </Flex>
        <SimpleGrid cols={2}>
          <TextInput label="Овог" {...form.getInputProps('lastName')} />
          <TextInput label="Нэр" {...form.getInputProps('firstName')} />
          <TextInput
            label="Хэрэглэгчийн нэр"
            {...form.getInputProps('username')}
          />
          <TextInput label="Имэйл" {...form.getInputProps('email')} />
          <DateInput
            valueFormat="YYYY MMM DD"
            label="Date input"
            placeholder="Date input"
            {...form.getInputProps('birthDate')}
          />
          <Select
            data={['Male', 'Femail']}
            label="Хүйс"
            {...form.getInputProps('gender')}
          />
          <TextInput
            disabled
            label="Certification ID"
            value={volunteer.id as unknown as string}
          />
        </SimpleGrid>
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
              defaultValue={form.getInputProps('address.provinceName').value}
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
        <Center>
          <Button
            radius={'lg'}
            color="primary"
            type="submit"
            loading={isLoading}
          >
            Хадгалах
          </Button>
        </Center>
      </Stack>
    </form>
  );
};
