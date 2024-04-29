import DashboardLayout from '@/components/layout/dashboard-layout';
import { getServerAuthSession } from '@/lib/auth';
import { db } from '@/server/db';
import { api } from '@/utils/api';
import {
  Button,
  Container,
  Flex,
  LoadingOverlay,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { createServerSideHelpers } from '@trpc/react-query/server';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { appRouter } from '@/server/api/root';
import { useRouter } from 'next/router';

export default function New(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { code, stateCode } = props;
  console.log(code, stateCode);
  const router = useRouter();
  const form = useForm({
    initialValues: {
      name: '',
      countryCode: code,
      stateCode: stateCode,
    },
  });

  const { mutate, isLoading } = api.data.createCity.useMutation();
  function handleSubmit(values: typeof form.values) {
    mutate(values, {
      onSuccess: () => {
        router.push(`/admin/country/${code}/states/${stateCode}`);
      },
    });
  }
  if (!code) return <LoadingOverlay />;
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

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getServerAuthSession(context);

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      db: db,
      userId: session?.user.id ? session.user.id : undefined,
      userType: session?.user.userType ? session?.user.userType : undefined,
      role: session?.user.role,
    },
  });

  const code = context.params?.code;
  const stateCode = context.params?.stateCode;

  if (typeof code !== 'string') throw new Error('no id');

  return {
    props: {
      trpcState: helpers.dehydrate(),
      code,
      stateCode,
    },
  };
};
