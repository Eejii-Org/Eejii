import { createServerSideHelpers } from '@trpc/react-query/server';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import superjson from 'superjson';

import {
  Text,
  ActionIcon,
  Container,
  Flex,
  Grid,
  LoadingOverlay,
  Paper,
  Title,
  UnstyledButton,
  Space,
  NumberInput,
  Group,
  Radio,
  Stack,
  Checkbox,
  TextInput,
  Button,
  Avatar,
  Center,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { getServerAuthSession } from '@/lib/auth';
import { appRouter } from '@/server/api/root';
import { db } from '@/server/db';
import Link from 'next/link';
import { api } from '@/utils/api';
import { useState } from 'react';
import { priceFormat } from '@/lib/utils/price';
import { useForm } from '@mantine/form';
import { FallbackImage } from '@/components/common/fallback-image';

const AmountCard = ({
  amount,
  setSelectedAmount,
  selectedAmount,
}: {
  amount: number | string;
  setSelectedAmount: (value: number | string) => void;
  selectedAmount: number | string;
}) => {
  return (
    <UnstyledButton
      h="100%"
      onClick={e => {
        e.preventDefault();
        setSelectedAmount(selectedAmount === amount ? 0 : amount);
      }}
    >
      <Paper
        h="100%"
        my="auto"
        radius={'md'}
        bg={selectedAmount === amount ? 'primary' : 'white'}
        c={selectedAmount === amount ? 'white' : ''}
        withBorder
        py="30"
        px="15"
      >
        <Text fw="600">
          {amount !== 'custom' && (amount as number) > 0
            ? priceFormat(+amount, 'MNT')
            : 'Хэмжээг тохируулах'}
        </Text>
      </Paper>
    </UnstyledButton>
  );
};

export default function Donate(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { slug } = props;
  const { data: project, isLoading } = api.project.findBySlug.useQuery({
    slug: slug as string,
  });
  const form = useForm({
    initialValues: {
      amount: 0,
      privacy: '',
      thankYouLetter: {
        firstName: '',
        lastName: '',
        email: '',
      },
    },
  });

  const [selectedAmount, setSelectedAmount] = useState<number | string>(0);
  const [thankYouChecked, setThankYouChecked] = useState<boolean>(false);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  const amounts = [1500000, 2500000, 5000000, 10000000, 'custom'];
  function handleSubmit(values: typeof form.values) {
    console.log(values);
  }

  return (
    <Container size={'xl'} mt={'lg'}>
      <Space h={'xl'} />
      <Flex justify={'start'} gap={10} mb={10}>
        <ActionIcon
          component={Link}
          href={`/projects/${slug}`}
          radius={'xl'}
          size={'xl'}
          variant="light"
        >
          <IconArrowLeft />
        </ActionIcon>
        <Title order={1} pl={10}>
          {project?.title}
        </Title>
      </Flex>
      <Space h={'xl'} />
      <Title mb={'lg'} order={4}>
        Хэмжээ
      </Title>
      <Grid columns={12} gutter={'xl'}>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <form onSubmit={form.onSubmit(handleSubmit)}></form>
          <Group
            grow
            preventGrowOverflow={false}
            wrap="wrap"
            gap={10}
            align="center"
          >
            {amounts.map(amount => (
              <AmountCard
                amount={amount}
                selectedAmount={selectedAmount}
                setSelectedAmount={setSelectedAmount}
                key={amount}
              />
            ))}
          </Group>

          {selectedAmount === 'custom' && (
            <NumberInput
              mt="lg"
              radius={'md'}
              size="lg"
              placeholder="Хэмжээг оруулах"
            />
          )}
          <Space h="lg" />
          <Title mb="lg" order={4}>
            Нууцлал
          </Title>
          <Radio.Group name="privacy" {...form.getInputProps('privacy')}>
            <Group mt="xs">
              <Radio value="show_all" label="Нэр болон үнийн дүнг харуулах" />
              <Radio
                value="show_only_name"
                label="Нэр харуулах үнийн дүнг нуух"
              />
              <Radio value="hide_all" label="Нууцлах" />
            </Group>
          </Radio.Group>
          <Space h="lg" />
          <Title mb="lg" order={4}>
            Талархлын бичиг
          </Title>
          <Checkbox
            radius={'lg'}
            label="Талархлын бичиг авах"
            checked={thankYouChecked}
            onChange={event => setThankYouChecked(event.currentTarget.checked)}
          />
          {thankYouChecked && (
            <Stack mt={'lg'} maw={500}>
              <FallbackImage height={250} width={200} src={''} alt="tnku" />
              <Group
                grow
                preventGrowOverflow={false}
                wrap="wrap"
                gap={20}
                align="center"
              >
                <TextInput label="Овог" placeholder="..." />
                <TextInput label="Нэр" placeholder="..." />
                <TextInput
                  label="Мэйл хаяг"
                  placeholder="example@example.com"
                />
              </Group>
            </Stack>
          )}
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Paper radius={'md'} bg={'white'} withBorder px="30" py="20">
            <Stack>
              <Center>
                <Title order={3}>Хандив</Title>
              </Center>
              <Text>Төсөл санаачлагч байгуулага</Text>
              <Flex align={'center'} gap="md">
                <Avatar />
                <Text>{project?.Owner?.organizationName}</Text>
              </Flex>
              <Text>Хамтрагч байгуулага</Text>
              {project?.Collaborators &&
                project?.Collaborators?.length > 0 &&
                project?.Collaborators.map(c => (
                  <Flex align={'center'} gap="md" key={c.id}>
                    <Avatar />
                    <Text>{c.User?.organizationName}</Text>
                  </Flex>
                ))}
              <Text>Хандивлах дүн</Text>
              <Text fw={500} size="lg">
                {priceFormat(+selectedAmount ?? 0, 'MNT')}
              </Text>
            </Stack>
            <Button
              fullWidth
              mt={'lg'}
              radius={'lg'}
              size="lg"
              color={'primary'}
            >
              Qpay ээр хандив өгөх
            </Button>
          </Paper>
        </Grid.Col>
      </Grid>
      <Space h={'xl'} />
    </Container>
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
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if (typeof slug !== 'string') throw new Error('no id');

  await helpers.project.findBySlug.prefetch({ slug: slug });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      slug,
    },
  };
};
