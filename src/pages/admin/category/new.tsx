import DashboardLayout from '@/components/layout/dashboard-layout';
import { api } from '@/utils/api';
import { Button, Container, Flex, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const Select = dynamic(() => import('@mantine/core').then(el => el.Select), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});
export default function New() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      name: '',
      type: '',
    },
  });

  const { mutate, isLoading } = api.category.create.useMutation();
  function handleSubmit(values: typeof form.values) {
    mutate(values, {
      onSuccess: () => {
        router.push('/admin/category');
      },
    });
  }
  return (
    <DashboardLayout>
      <Container size={'sm'} p={'xl'}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Flex direction={'column'} gap={'lg'}>
            <TextInput
              placeholder="Name"
              label="Name"
              {...form.getInputProps('name')}
            />
            <Select
              label="Type"
              placeholder="Choose type"
              {...form.getInputProps('type')}
              data={['Event', 'Project']}
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
