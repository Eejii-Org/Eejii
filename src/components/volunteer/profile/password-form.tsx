import type { User } from '@/lib/types';
import { api } from '@/utils/api';
import {
  Button,
  Center,
  Grid,
  PasswordInput,
  Stack,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export const PasswordForm = ({ volunteer }: { volunteer: User }) => {
  const { mutate, isLoading } = api.user.passwordChange.useMutation({
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Successfully changed password',
      });
    },
  });

  const form = useForm({
    initialValues: {
      newPassword: '',
      oldPassword: '',
      confirmPassword: '',
    },
    validateInputOnChange: true,
    validate: values => {
      return {
        newPassword:
          values.newPassword.length < 6
            ? 'Password must include at least 6 characters'
            : values.newPassword == values.confirmPassword
              ? null
              : 'Password is not same',
        confirmPassword:
          values.confirmPassword.length < 6
            ? 'confirmPassword must include at least 6 characters'
            : values.newPassword == values.confirmPassword
              ? null
              : 'Password is not same',
      };
    },
  });

  function handleSubmit(values: typeof form.values) {
    const formValues = { ...values, userId: volunteer.id as unknown as string };
    mutate(formValues);
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Title order={4}>Нууц үг солих</Title>
        <Grid columns={12}>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <PasswordInput
              label="Хуучин нууц үг"
              {...form.getInputProps('oldPassword')}
            />
          </Grid.Col>
          <Grid.Col span={6}></Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <PasswordInput
              label="Шинэ нууц үг"
              w={'100%'}
              {...form.getInputProps('newPassword')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <PasswordInput
              label="Шинэ нууц үг давтах"
              w={'100%'}
              {...form.getInputProps('confirmPassword')}
            />
          </Grid.Col>
        </Grid>
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
