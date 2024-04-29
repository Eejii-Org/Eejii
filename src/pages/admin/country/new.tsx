import DashboardLayout from '@/components/layout/dashboard-layout';
import { api } from '@/utils/api';
import { Button, Container, Flex, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';

export default function New() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      name: '',
      code: '',
    },
  });

  const { mutate, isLoading } = api.data.createCountry.useMutation();
  function handleSubmit(values: typeof form.values) {
    mutate(values, {
      onSuccess: () => {
        router.push('/admin/country');
      },
    });
  }
  return (
    <DashboardLayout>
      <Container size={'sm'} p={'xl'}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Flex direction={'column'} gap={'lg'}>
            <TextInput
              placeholder="Code"
              label="Code"
              {...form.getInputProps('code')}
            />
            <TextInput
              placeholder="Name"
              label="Name"
              {...form.getInputProps('name')}
            />
            <Button loading={isLoading} fullWidth type="submit">
              Submit
            </Button>
          </Flex>
        </form>
      </Container>
    </DashboardLayout>
  );
}
