import { api } from '@/utils/api';
import { Skeleton, Box } from '@mantine/core';
import dynamic from 'next/dynamic';

const Select = dynamic(() => import('@mantine/core').then(el => el.Select), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export const SelectCityField = ({
  country,
  state,
  defaultValue,
  handleChange,
}: {
  defaultValue?: string | null;
  country: string;
  state: string;
  handleChange: (value: string) => void;
}) => {
  const { data: cities, isLoading } =
    api.data.findCitiesByCountryAndState.useQuery({
      country: country,
      state: state,
    });

  const citiesArray = cities?.map(c => c.name);

  return (
    <Box w="100%">
      {!isLoading && cities ? (
        <Select
          radius={'xl'}
          searchable
          defaultValue={defaultValue}
          data={citiesArray}
          label="Хот"
          placeholder="Хот сонгоно уу"
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
