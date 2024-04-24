import { MediaList } from '@/components/list/media-list';
import type { Media } from '@/lib/types';
import { api } from '@/utils/api';
import { Center, Pagination, Stack } from '@mantine/core';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const StandartPartnersMediaList = ({
  partnerId,
}: {
  partnerId: string;
}) => {
  const router = useRouter();
  const { mediaPage } = router.query;
  const [activePage, setActivePage] = useState(mediaPage ? +mediaPage : 1);
  const { data: medias, isLoading } = api.media.findAll.useQuery({
    ownerId: partnerId,
    limit: 4,
    page: activePage,
  });

  const totalPages =
    medias && medias?.length > 0 ? Math.ceil(medias?.length / 4) : 0;
  return (
    <Stack gap="xl">
      <div className="w-[283px]  m-auto">
        <h5 className="text-2xl pt-12 pb-2 text-center uppercase font-semibold border-b-4 border-primary">
          Төсөл хөтөлбөрүүд
        </h5>
      </div>
      <MediaList medias={medias as unknown as Media[]} isLoading={isLoading} />
      <Center>
        <Pagination
          total={totalPages}
          radius="xl"
          value={activePage}
          onChange={value => {
            setActivePage(value);
            router.push({
              pathname: router.pathname,
              query: { ...router.query, eventPage: value },
            });
          }}
        />
      </Center>
    </Stack>
  );
};
