import { api } from '@/utils/api';
import { Button, Modal, NumberInput, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconAward } from '@tabler/icons-react';

export const CalculatePointModal = ({
  slug,
  point,
}: {
  slug: string;
  point: number | null;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      point: point ?? 0,
    },
    validateInputOnChange: true,
    validate: {
      point: value => (value > 6 ? 'Value should not exceed 6' : null),
    },
  });

  const context = api.useUtils();
  const { mutate, isLoading } = api.event.calculateMaxPoint.useMutation({
    onSuccess: res => {
      context.event.findBySlug.invalidate({ slug: res.slug });
      close();
      notifications.show({
        title: 'Success',
        message: 'Successfully set the max point',
        color: 'green',
      });
    },
  });
  function handleSubmit(values: typeof form.values) {
    mutate({ ...values, eventSlug: slug });
  }
  return (
    <div>
      <Button
        color="secondary"
        leftSection={<IconAward />}
        type="button"
        onClick={open}
      >
        Calculate max point
      </Button>
      <Modal opened={opened} onClose={close} title="Calculate max point">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <NumberInput
              {...form.getInputProps('point')}
              label="Point"
              description="Max point which the event should give to volunteer"
            />
            <Button loading={isLoading} fullWidth type="submit">
              Submit
            </Button>
          </Stack>
        </form>
      </Modal>
    </div>
  );
};
