import { type User } from '@/lib/types';
import { Paper, Rating, Stack, Text } from '@mantine/core';
import { IconShieldStar } from '@tabler/icons-react';
import Link from 'next/link';
import { FallbackImage } from '../common/fallback-image';
import { PartnerType } from '@/lib/db/enums';

export const PartnerCard = ({ partner }: { partner: User }) => {
  const image =
    partner?.Images?.length > 0
      ? process.env.NEXT_PUBLIC_AWS_PATH +
        '/' +
        partner.Images.find(i => i.type === 'main')?.path
      : '';

  return (
    <Paper
      withBorder
      shadow="md"
      p={20}
      radius={'md'}
      component={Link}
      href={`/partners/${partner.id}`}
    >
      <Stack gap={'xs'}>
        <FallbackImage height={70} width={70} src={image} alt="library" />
        <span className="flex items-center gap-2">
          <h1 className="text-md font-bold">
            {partner?.organizationName ?? partner?.email}
          </h1>
          {partner?.Subscription?.code === PartnerType.PREMIUM && (
            <IconShieldStar />
          )}
        </span>
        <span className="flex items-center">
          <Rating
            fractions={2}
            defaultValue={1.5}
            color="rgba(255, 231, 13, 1)"
          />
          <h2 className="h-4 w-[19px] text-sm font-bold text-[#616161]"></h2>
        </span>
        <Text size="md" c="[#616161]">
          {partner?.bio}
        </Text>
      </Stack>
    </Paper>
  );
};
