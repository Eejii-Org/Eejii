import { FallbackImage } from '@/components/common/fallback-image';
import type { User } from '@/lib/types';
import {
  Container,
  Flex,
  Stack,
  Title,
  Text,
  Group,
  ActionIcon,
  Button,
} from '@mantine/core';
import { IconHeart, IconMapPin, IconShare } from '@tabler/icons-react';
import { StandartPartnersProjectList } from '../standart/project-list';
import { StandartPartnersEventList } from '../standart/event-list';
import { StandartPartnersMediaList } from '../standart/media-list';

export const BasicPartnerDetail = ({ partner }: { partner: User }) => {
  const image =
    partner?.Images?.length > 0
      ? process.env.NEXT_PUBLIC_AWS_PATH +
        '/' +
        partner.Images.find(i => i.type === 'main')?.path
      : '';

  return (
    <Container size={'xl'} mt={50}>
      <Flex justify={'space-between'} gap={'xl'}>
        <Stack>
          <Title>{partner?.organizationName}</Title>
          <Text c={'dimmed'} className="flex gap-2">
            <IconMapPin />
            {/* TODO Addres */}
          </Text>
          <Text>{partner?.bio}</Text>
          <Group>
            <ActionIcon variant="transparent">
              <IconShare />
            </ActionIcon>
            <ActionIcon variant="transparent">
              <IconHeart />
            </ActionIcon>
            <Button radius={'lg'} color="primary">
              Donate
            </Button>
          </Group>
        </Stack>
        <FallbackImage
          src={image}
          alt="img"
          width={500}
          height={400}
          radius={'lg'}
        />
      </Flex>

      <StandartPartnersProjectList
        partnerId={partner.id as unknown as string}
      />
      <StandartPartnersEventList partnerId={partner.id as unknown as string} />

      <StandartPartnersMediaList partnerId={partner.id as unknown as string} />
    </Container>
  );
};
