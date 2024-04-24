import type { Banner } from '@/lib/db/types';
import { api } from '@/utils/api';
import { Button, Skeleton, Stack, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import dynamic from 'next/dynamic';

type FormValuesType = {
  title: string | null;
  link: string | null;
  description: string | null;
  positionCode: string;
};
const Select = dynamic(() => import('@mantine/core').then(el => el.Select), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export const BannerForm = ({
  banner,
  isPending,
  handleSubmit,
}: {
  banner: Banner | undefined;
  isPending: boolean;
  handleSubmit: (values: FormValuesType) => void;
}) => {
  const { data: positions, isLoading: isPositionsLoading } =
    api.banner.getBannerPositions.useQuery();
  const positionArray = positions?.map(p => ({ label: p.code, value: p.id }));
  const form = useForm({
    initialValues: {
      title: banner?.title ?? '',
      link: banner?.link ?? '',
      description: banner?.description ?? '',
      positionCode: banner?.bannerPositionId ?? '',
    },
  });
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          {...form.getInputProps('title')}
          placeholder="Title"
          label="Title"
        />
        <Textarea
          {...form.getInputProps('description')}
          placeholder="Description"
          label="Description"
        />
        <TextInput
          {...form.getInputProps('link')}
          placeholder="Link"
          label="Link"
        />
        {!isPositionsLoading ? (
          <Select
            label="Position"
            data={positionArray}
            {...form.getInputProps('positionCode')}
          />
        ) : (
          <Skeleton h={30} w={100} />
        )}
        <Button
          fullWidth
          type="submit"
          loading={isPending}
          disabled={!form.isValid}
        >
          Submit
        </Button>
      </Stack>
    </form>
  );
};
