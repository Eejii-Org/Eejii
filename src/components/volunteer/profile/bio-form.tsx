import type { User } from '@/lib/types';
import { api } from '@/utils/api';
import {
  Badge,
  Button,
  Center,
  Group,
  Skeleton,
  Stack,
  Textarea,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

export const BioForm = ({ volunteer }: { volunteer: User }) => {
  const { data: skills, isLoading } = api.volunteer.getSkills.useQuery();
  const selectedSkillsId = volunteer.UserSkills?.map(s => s.skillId) ?? [];
  const [selectedSkills, setSelectedSkills] = useState(selectedSkillsId);

  function handleSkillChange(value: string) {
    const exists = selectedSkills?.find(selected => selected === value);
    if (exists) {
      setSelectedSkills(prev => prev.filter(skill => skill !== value));
    } else {
      setSelectedSkills(prev => [...prev, value]);
    }
  }

  const { mutate, isLoading: isPending } = api.volunteer.updateBio.useMutation({
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Successfully updated message',
      });
    },
  });

  const form = useForm({
    initialValues: {
      bio: volunteer.bio ?? '',
      skills: selectedSkills ?? [''],
    },
  });

  function handleSubmit(values: typeof form.values) {
    const formValues = {
      ...values,
      userId: volunteer.id as unknown as string,
      skills: selectedSkills,
    };
    mutate(formValues);
  }
  console.log(selectedSkillsId);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Title order={4}>Био</Title>
        <Textarea
          label="Био"
          minRows={4}
          maxRows={8}
          autosize
          {...form.getInputProps('bio')}
        />
        <Title order={4}>Ур чадвар</Title>
        {!isLoading ? (
          <Group>
            {skills?.map(skill => (
              <Badge
                size="lg"
                onClick={() => handleSkillChange(skill.id)}
                style={{ cursor: 'pointer' }}
                variant={
                  selectedSkills?.find(selected => selected === skill.id)
                    ? 'filled'
                    : 'outline'
                }
                key={skill.id}
                color="gray.6"
              >
                {skill.name}
              </Badge>
            ))}
          </Group>
        ) : (
          <Group>
            <Skeleton h={50} w={150} />
          </Group>
        )}
        <Center>
          <Button
            radius={'lg'}
            color="primary"
            type="submit"
            loading={isPending}
          >
            Хадгалах
          </Button>
        </Center>
      </Stack>
    </form>
  );
};
