import type { Project } from '@/lib/types';
import type { projectSchema } from '@/lib/validation/project-schema';
import { inputStyle } from '@/styles/inputStyle';
import {
  Flex,
  InputLabel,
  Paper,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import type { UseFormReturnType } from '@mantine/form';
import type { z } from 'zod';
import { FormStep } from '../form-stepper';

export const GrantFundraisingFormFields = ({
  data,
  form,
}: {
  data: Project | undefined;
  form: UseFormReturnType<z.infer<typeof projectSchema>>;
}) => {
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
        <FormStep line step={2} />
        <Stack w={'100%'}>
          <InputLabel size="xl">Link</InputLabel>
          <Paper withBorder p={20} radius={'xl'} py={30}>
            <TextInput
              {...form.getInputProps('link')}
              placeholder="Link"
              w={'100%'}
              size="lg"
              styles={inputStyle}
            />
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
    </Stack>
  );
};
