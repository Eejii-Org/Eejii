import { api } from '@/utils/api';
import { Skeleton, Box } from '@mantine/core';
import dynamic from 'next/dynamic';

const Select = dynamic(() => import('@mantine/core').then(el => el.Select), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export const SelectStateField = ({
  country,
  defaultValue,
  handleChange,
}: {
  country: string;
  defaultValue?: string | null;
  handleChange: (value: string) => void;
}) => {
  const { data: states, isLoading } = api.data.findStatesByCountry.useQuery({
    country: country,
  });
  const statesArray = states?.map(c => {
    const obj = { label: c.name as string, value: c.code as string };
    return obj;
  });

  return (
    <Box w="100%">
      {!isLoading && states ? (
        <Select
          radius={'xl'}
          searchable
          defaultValue={defaultValue}
          data={statesArray}
          label="Аймаг"
          placeholder="Аймаг сонгоно уу"
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
