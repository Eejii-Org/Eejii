import type { Event, EventRoleFormType } from '@/lib/types';
import type { eventSchema } from '@/lib/validation/event-schema';
import { inputStyle } from '@/styles/inputStyle';
import { api } from '@/utils/api';
import {
  ActionIcon,
  Button,
  Chip,
  Fieldset,
  Flex,
  Group,
  InputLabel,
  NumberInput,
  Paper,
  Skeleton,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import type { UseFormReturnType } from '@mantine/form';
import { useState } from 'react';
import type { z } from 'zod';
import { FormStep } from '../form-stepper';
import { IconPlus, IconTrash } from '@tabler/icons-react';

export const VolunteeringEventFormFields = ({
  data,
  form,
}: {
  data: Event | undefined;
  form: UseFormReturnType<z.infer<typeof eventSchema>>;
}) => {
  const { data: categories, isLoading: isCategoryLoading } =
    api.category.findAll.useQuery({ name: null, type: null });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  function handleSelectCategory(values: string[]) {
    setSelectedCategories(values);
    form.setFieldValue('categories', values);
  }

  const handleAddRole = () => {
    form.setValues({
      ...form.values,
      roles: [
        ...(form?.values?.roles as EventRoleFormType),
        { name: '', slots: 0 },
      ],
    });
  };

  const handleRemoveRole = (index: number) => {
    form.setValues({
      ...form.values,
      roles: form.values?.roles?.filter((_, i) => i !== index),
    });
  };

  return (
    <Stack>
      <div className="flex gap-4">
        <FormStep step={1} line />
        <Stack w={'100%'}>
          <InputLabel size="xl">Title</InputLabel>
          <Paper withBorder p={20} radius={'xl'} py={30}>
            <TextInput
              {...form.getInputProps('title')}
              placeholder="Title"
              w={'100%'}
              size="lg"
              styles={inputStyle}
            />
          </Paper>
        </Stack>
      </div>

      <div className="flex gap-4">
        <FormStep line step={6} />
        <Stack w={'100%'}>
          <InputLabel size="xl">Description</InputLabel>
          <Paper withBorder p={20} radius={'xl'} py={30}>
            <Textarea
              {...form.getInputProps('description')}
              placeholder="Write description"
              w={'100%'}
              size="md"
            />
          </Paper>
        </Stack>
      </div>
      <div className="flex gap-4">
        <FormStep line step={6} />
        <Stack w={'100%'}>
          <InputLabel size="xl">Location</InputLabel>
          <Paper withBorder p={20} radius={'xl'} py={30}>
            <Textarea
              {...form.getInputProps('location')}
              placeholder="Write description"
              w={'100%'}
              size="md"
            />
          </Paper>
        </Stack>
      </div>
      <div className="flex gap-4">
        <FormStep step={1} line />
        <Stack w={'100%'}>
          <InputLabel size="xl">Max volunteers</InputLabel>
          <Paper withBorder p={20} radius={'xl'} py={30}>
            <NumberInput
              {...form.getInputProps('maxVolunteers')}
              placeholder="Max volunteers"
              defaultValue={0}
              w={'100%'}
              size="lg"
              styles={inputStyle}
            />
          </Paper>
        </Stack>
      </div>
      <div className="flex gap-4">
        <FormStep step={1} line />
        <Stack w={'100%'}>
          <InputLabel size="xl">Volunteering hours</InputLabel>
          <Paper withBorder p={20} radius={'xl'} py={30}>
            <NumberInput
              {...form.getInputProps('volunteeringHours')}
              placeholder="Volunteering hours"
              defaultValue={0}
              w={'100%'}
              size="lg"
              styles={inputStyle}
            />
          </Paper>
        </Stack>
      </div>
      <div className="flex gap-4">
        <FormStep line step={2} />
        <Stack w={'100%'}>
          <InputLabel size="xl">Roles</InputLabel>
          <Paper withBorder p={20} radius={'xl'} py={30}>
            {form.values.roles &&
              form.values.roles.length > 0 &&
              form.values.roles?.map((_, i) => {
                return (
                  <Fieldset
                    legend={`Role ${i + 1}`}
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 20,
                      alignItems: 'center',
                    }}
                  >
                    <TextInput
                      {...form.getInputProps(`roles.${i}.name`)}
                      placeholder="Role name"
                      w={'100%'}
                      size="lg"
                      inputWrapperOrder={[
                        'label',
                        'error',
                        'input',
                        'description',
                      ]}
                      styles={inputStyle}
                    />
                    <NumberInput
                      {...form.getInputProps(`roles.${i}.slots`)}
                      placeholder="Role slots"
                      w={'100%'}
                      size="lg"
                      inputWrapperOrder={[
                        'label',
                        'error',
                        'input',
                        'description',
                      ]}
                      rightSection={''}
                      styles={inputStyle}
                    />
                    <ActionIcon
                      type="button"
                      size={'xl'}
                      radius="md"
                      color="red"
                      onClick={() => handleRemoveRole(i)}
                    >
                      <IconTrash />
                    </ActionIcon>
                  </Fieldset>
                );
              })}
            <Button
              mt="md"
              type="button"
              onClick={handleAddRole}
              leftSection={<IconPlus />}
            >
              Add role
            </Button>
          </Paper>
        </Stack>
      </div>
      <div className="flex gap-4">
        <FormStep line step={5} />
        <Stack w={'100%'}>
          <InputLabel size="xl">
            Арга хэмжээ эхлэх болон дуусах хугацаа
          </InputLabel>
          <Paper withBorder p={20} radius={'xl'} py={30}>
            <Flex gap={20}>
              <DateTimePicker
                defaultValue={
                  data?.startTime !== undefined
                    ? (data?.startTime as unknown as Date)
                    : null
                }
                {...form.getInputProps('startTime')}
                valueFormat="YYYY-M-DD hh:mm:ss"
                label="Pick date and time"
                placeholder="Pick start time"
                w={'100%'}
              />
              <DateTimePicker
                defaultValue={
                  data?.endTime !== undefined
                    ? (data?.endTime as unknown as Date)
                    : null
                }
                {...form.getInputProps('endTime')}
                valueFormat="YYYY-M-DD hh:mm:ss"
                label="Pick date and time"
                placeholder="Pick end time"
                w={'100%'}
              />
            </Flex>
          </Paper>
        </Stack>
      </div>
      <div className="flex gap-4">
        <FormStep line step={4} />
        <Stack w={'100%'}>
          <InputLabel size="xl">Contact</InputLabel>
          <Paper withBorder p={20} radius={'xl'} py={30}>
            <span>
              Энэхүү үйл ажиллагаан холбогдох хүний талаар мэдээллйиг оруулаарай
            </span>
            <Flex gap={20}>
              <TextInput
                {...form.getInputProps('contact.phone')}
                placeholder="Phone"
                w={'100%'}
                size="lg"
                styles={inputStyle}
              />
              <TextInput
                {...form.getInputProps('contact.email')}
                placeholder="Email"
                w={'100%'}
                size="lg"
                styles={inputStyle}
              />
            </Flex>
          </Paper>
        </Stack>
      </div>
      <div className="flex gap-4">
        <FormStep line step={3} />
        <Stack w={'100%'}>
          <InputLabel size="xl">Category</InputLabel>
          <Paper withBorder p={20} radius={'xl'} py={30}>
            {!isCategoryLoading && categories ? (
              <Chip.Group
                multiple
                value={selectedCategories}
                onChange={handleSelectCategory}
              >
                <Group justify="center" mt="md">
                  {categories.map(c => (
                    <Chip value={c.id} key={c.id}>
                      {c.name}
                    </Chip>
                  ))}
                </Group>
              </Chip.Group>
            ) : (
              <Flex gap={10}>
                <Skeleton h={30} w={90} radius="xl" />
                <Skeleton h={30} w={110} radius={'xl'} />
                <Skeleton h={30} w={70} radius={'xl'} />
                <Skeleton h={30} w={90} radius={'xl'} />
              </Flex>
            )}
          </Paper>
        </Stack>
      </div>
    </Stack>
  );
};
