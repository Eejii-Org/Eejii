import type { BannerPosition } from '@/lib/db/types';
import { Button, Stack, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';

type FormValueType = {
  code: string;
  label: string;
};

export const BannerPositionForm = ({
  position,
  isPending,
  handleSubmit,
}: {
  position: BannerPosition | undefined;
  isPending: boolean;
  handleSubmit: (values: FormValueType) => void;
}) => {
  const form = useForm({
    initialValues: {
      code: position?.code ?? '',
      label: position?.label ?? '',
    },
  });

  //TODO just sajdf as
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          {...form.getInputProps('code')}
          description="Code for banner must be unique"
          placeholder="home_slider_1..."
          label="Code"
        />
        <Textarea
          {...form.getInputProps('label')}
          description="Label to describe the banner for future use"
          placeholder="Banner in home slider 1"
          label="Label"
        />
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
