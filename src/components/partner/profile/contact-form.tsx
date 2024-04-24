import type { Contact, User } from '@/lib/types';
import { inputStyle } from '@/styles/inputStyle';
import { api } from '@/utils/api';
import { Button, Flex, Paper, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export const ContactForm = ({ user }: { user: User }) => {
  const form = useForm({
    initialValues: {
      phone: (user?.contact as Contact)?.phone ?? '',
      email: (user?.contact as Contact)?.email ?? '',
      facebookUrl: (user?.contact as Contact)?.facebookUrl ?? '',
      instagramUrl: (user?.contact as Contact)?.instagramUrl ?? '',
    },
  });

  const context = api.useContext();
  const { mutate, isLoading } = api.partner.updateContact.useMutation({
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Successfully updated contact',
        color: 'green',
      });
      context.user.getMe.invalidate();
    },
  });
  function handleSubmit(values: typeof form.values) {
    mutate({ contact: values });
  }

  return (
    <Paper withBorder p={40} radius={'lg'}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Flex justify={'space-between'} gap={40}>
          <Stack w={'100%'}>
            <Title order={3}>Contact</Title>
            <Flex gap={20}>
              <TextInput
                {...form.getInputProps('email')}
                w={'100%'}
                placeholder="Email"
                description="Your email here"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                styles={inputStyle}
              />
              <TextInput
                {...form.getInputProps('phone')}
                w={'100%'}
                placeholder="Phone number"
                description="Phone number here"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                styles={inputStyle}
              />
            </Flex>
            <Flex gap={20}>
              <TextInput
                {...form.getInputProps('instagramUrl')}
                w={'100%'}
                placeholder="Instagram"
                description="Your email here"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                styles={inputStyle}
              />
              <TextInput
                {...form.getInputProps('facebookUrl')}
                w={'100%'}
                placeholder="Facebook"
                description="Phone number here"
                inputWrapperOrder={['label', 'error', 'input', 'description']}
                styles={inputStyle}
              />
            </Flex>
          </Stack>
        </Flex>
        <Flex justify={'end'}>
          <Button
            radius={'xl'}
            type="submit"
            disabled={isLoading || !form.isValid}
          >
            Submit
          </Button>
        </Flex>
      </form>
    </Paper>
  );
};
