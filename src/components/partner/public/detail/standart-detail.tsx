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
  Paper,
  Avatar,
  Space,
} from '@mantine/core';
import { IconHeart, IconMapPin, IconShare } from '@tabler/icons-react';
import { StandartPartnersProjectList } from '../standart/project-list';
import { StandartPartnersEventList } from '../standart/event-list';
import { StandartPartnersMediaList } from '../standart/media-list';

export const StandartPartnerDetail = ({ partner }: { partner: User }) => {
  const image =
    partner?.Images?.length > 0
      ? process.env.NEXT_PUBLIC_AWS_PATH +
        '/' +
        partner.Images.find(i => i.type === 'main')?.path
      : '';

  return (
    <div className="relative">
      <FallbackImage
        fullWidth
        height={400}
        width={1200}
        src={image}
        alt="img"
      />
      <div className="w-full -translate-y-16">
        <Container size={'xl'} mx={'auto'}>
          <Paper withBorder shadow="md" radius={'lg'} p={'lg'}>
            <Flex gap={'xl'}>
              <Avatar size={150} />
              <Stack justify="space-between" w={'100%'}>
                <Title fz={{ base: 30, lg: 50 }}>
                  {partner?.organizationName}
                </Title>
                <Text>{partner?.introduction}</Text>
                <Flex justify={'space-between'} align={'center'} w={'100%'}>
                  <Text c={'dimmed'} className="flex gap-2">
                    <IconMapPin />
                  </Text>
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
                </Flex>
              </Stack>
            </Flex>
          </Paper>
          <div className="m-auto  w-[283px]">
            <h5 className="border-b-4 border-primary pb-2 pt-12 text-center text-2xl font-semibold uppercase">
              Бидний тухай
            </h5>
          </div>
          <Space h="lg" />
          <Flex
            justify={{ base: 'center', lg: 'space-between' }}
            direction={{ base: 'column', lg: 'row' }}
            gap={'lg'}
          >
            <FallbackImage
              src={image}
              alt="img"
              width={1000}
              height={400}
              radius={'lg'}
            />
            <Text>{partner.bio}</Text>
          </Flex>
          <StandartPartnersProjectList
            partnerId={partner.id as unknown as string}
          />
          <StandartPartnersEventList
            partnerId={partner.id as unknown as string}
          />
          <StandartPartnersMediaList
            partnerId={partner.id as unknown as string}
          />
        </Container>
      </div>
    </div>
  );
};
