import DashboardLayout from '@/components/layout/dashboard-layout';
import { api } from '@/utils/api';
import {
  ActionIcon,
  Breadcrumbs,
  Anchor,
  Button,
  Flex,
  LoadingOverlay,
  Table,
  Text,
} from '@mantine/core';
import { getServerAuthSession } from '@/lib/auth';
import { db } from '@/server/db';
import { createServerSideHelpers } from '@trpc/react-query/server';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { appRouter } from '@/server/api/root';
import Link from 'next/link';
import { IconTrash, IconEye } from '@tabler/icons-react';

const TableRow = ({
  code,
  name,
  countryCode,
}: {
  code: string;
  name: string;
  countryCode: string;
}) => {
  const { mutate: deleteState, isLoading } = api.data.deleteState.useMutation();
  return (
    <Table.Tr>
      <Table.Td>{name}</Table.Td>
      <Table.Td>{code}</Table.Td>
      <Table.Td>
        <Table.Td>
          <div className="flex flex-row gap-2">
            <ActionIcon
              radius={'xl'}
              size={'lg'}
              variant="light"
              component={Link}
              href={`/admin/country/${countryCode}/states/${code}`}
            >
              <IconEye />
            </ActionIcon>
            <ActionIcon
              radius={'xl'}
              size={'lg'}
              color="red"
              loading={isLoading}
              onClick={() =>
                deleteState({ stateCode: code, countryCode: countryCode })
              }
            >
              <IconTrash />
            </ActionIcon>
          </div>
        </Table.Td>
      </Table.Td>
    </Table.Tr>
  );
};
export default function Index(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { code } = props;
  const { data, isLoading } = api.data.findStatesByCountry.useQuery(
    {
      country: code,
    },
    { enabled: !!code }
  );

  return (
    <DashboardLayout>
      <Flex>
        <Button component={Link} href={`/admin/country/${code}/states/new`}>
          Create state
        </Button>
      </Flex>
      <Breadcrumbs mb="md" separator="→" separatorMargin="md" mt="xs">
        <Anchor href="/admin" component={Link}>
          Dashboard
        </Anchor>
        <Anchor href="/admin/country" component={Link}>
          Country
        </Anchor>
        <Text c="dimmed" fw="600">
          {code} ({code} states)
        </Text>
      </Breadcrumbs>
      {!isLoading ? (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Code</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data?.map((d, i) => (
              <TableRow
                key={i}
                code={d.code as string}
                name={d.name}
                countryCode={d.countryCode as string}
              />
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <LoadingOverlay visible />
      )}
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

  if (typeof code !== 'string') throw new Error('no id');

  return {
    props: {
      trpcState: helpers.dehydrate(),
      code,
    },
  };
};
