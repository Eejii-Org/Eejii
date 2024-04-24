import { UserType } from '@/lib/db/enums';
import { api } from '@/utils/api';
import { Skeleton } from '@mantine/core';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const MultiSelect = dynamic(
  () => import('@mantine/core').then(el => el.MultiSelect),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

export const CollaboratorSelectField = ({
  handleChange,
  defaultValues,
}: {
  handleChange: (value: string[]) => void;
  defaultValues: string[];
}) => {
  const [search, setSearch] = useState('');

  const { data: collaborators, isLoading } =
    api.user.findUsersToInvite.useQuery({
      userType: UserType.USER_VOLUNTEER,
    });

  const array =
    collaborators && collaborators?.length > 0
      ? collaborators?.map(c => {
          return {
            label: c.organizationName ?? c.email,
            value: c.id as unknown as string,
          };
        })
      : [];

  return (
    <>
      {!isLoading ? (
        <MultiSelect
          defaultValue={defaultValues}
          defaultSearchValue=""
          data={array}
          onSearchChange={setSearch}
          onChange={handleChange}
          searchValue={search}
        />
      ) : (
        <Skeleton w={'100%'} h={50} />
      )}
    </>
  );
};
