import { PermitType } from '@/lib/db/enums';
import type { Permit } from '@/lib/db/types';
import { permitSchema } from '@/lib/validation/mutation-schema/permit-validation-schema';
import { api } from '@/utils/api';
import {
  Button,
  Group,
  Paper,
  Stack,
  TextInput,
  Textarea,
  NumberInput,
  Chip,
  InputLabel,
  Select,
  Skeleton,
  type ComboboxData,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useState } from 'react';
import { type z } from 'zod';

export const PermitForm = ({
  permit,
  handleSubmit,
  isPending,
}: {
  permit?: Permit;
  handleSubmit: (values: z.infer<typeof permitSchema>) => void;
  isPending: boolean;
}) => {
  const [type, setType] = useState<string>(PermitType.EVENT);

  const { data: bannerPositions, isLoading } =
    api.banner.getBannerPositions.useQuery();

  const positionsArray: ComboboxData =
    bannerPositions && bannerPositions.length > 0
      ? bannerPositions.map(p => ({ label: p.label, value: p.id }))
      : [];

  const form = useForm({
    initialValues: {
      code: permit?.code ?? '',
      name: permit?.name ?? '',
      description: permit?.description ?? '',
      price: permit ? permit?.price / 100 : 0,
      originalPrice: permit ? permit?.originalPrice / 100 : 0,
      quantity: permit?.quantity ?? 1,
      positionId: permit?.bannerPositionId ?? '',
    },
    validateInputOnChange: true,
    validate: zodResolver(permitSchema),
  });

  function handleFormSubmit(values: typeof form.values) {
    const formValues = {
      ...values,
      type: type,
      id: permit?.id as unknown as string,
    };
    handleSubmit(formValues);
  }

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Paper p={'md'} bg={'white'} shadow="md">
        <Stack>
          <Chip.Group multiple={false} value={type} onChange={setType}>
            <InputLabel>Type</InputLabel>
            <Group justify="start">
              <Chip value={PermitType.EVENT}>Event</Chip>
              <Chip value={PermitType.PROJECT}>Project</Chip>
              <Chip value={PermitType.BANNER}>Banner</Chip>
            </Group>
          </Chip.Group>
          {type === PermitType.BANNER &&
            (isLoading ? (
              <Skeleton h={30} w={100} />
            ) : (
              <Select
                data={positionsArray}
                {...form.getInputProps('positionId')}
                placeholder="Pick banner position"
                label="Banner position"
                disabled={isLoading}
              />
            ))}
          <TextInput label="Code" {...form.getInputProps('code')} />
          <TextInput label="Name" {...form.getInputProps('name')} />
          <Textarea
            label="Description"
            {...form.getInputProps('description')}
          />
          <NumberInput
            label="Price"
            leftSection="₮"
            decimalScale={2}
            thousandSeparator=","
            fixedDecimalScale
            hideControls
            {...form.getInputProps('price')}
          />
          <NumberInput
            leftSection="₮"
            decimalScale={2}
            thousandSeparator=","
            fixedDecimalScale
            hideControls
            label="Original price"
            {...form.getInputProps('originalPrice')}
          />
          <NumberInput label="Quantity" {...form.getInputProps('quantity')} />
          <Button fullWidth type="submit" loading={isPending}>
            Submit
          </Button>
        </Stack>
      </Paper>
    </form>
  );
};
