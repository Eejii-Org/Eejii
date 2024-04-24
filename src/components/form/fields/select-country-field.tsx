import { api } from '@/utils/api';
import { Box, Skeleton } from '@mantine/core';
import dynamic from 'next/dynamic';

const Select = dynamic(() => import('@mantine/core').then(el => el.Select), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export const SelectCountryField = ({
  defaultValue,
  handleChange,
}: {
  defaultValue?: string | null;
  handleChange: (value: string) => void;
}) => {
  const { data: countries, isLoading } = api.data.getCountries.useQuery();

  const countriesArray = countries?.map(c => {
    const obj = { label: c.name, value: c.code as string };
    return obj;
  });

  return (
    <Box w="100%">
      {!isLoading && countries ? (
        <Select
          radius={'xl'}
          searchable
          defaultValue={defaultValue}
          data={countriesArray}
          label="Улс"
          placeholder="Улс сонгоно уу"
          onChange={v => handleChange(v as string)}
          w={'100%'}
        />
      ) : (
        <div>
          <Skeleton w={'100'} h={15} mb={5} radius={'xl'} />
          <Skeleton w={'100%'} h={38} radius={'xl'} />
        </div>
      )}
    </Box>
  );
};
