import { api } from '@/utils/api';
import { Pagination } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MediaList } from '../list/media-list';
import type { Media } from '@/lib/types';

export const PublicMediaList = () => {
  const router = useRouter();
  const { category, categoryName, q, page } = router.query;
  const [activePage, setPage] = useState(page ? +page : 1);
  const limit = 9;

  function handleSetPage(value: number) {
    setPage(value);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: value },
    });
  }

  const {
    data: medias,
    isLoading,
    refetch,
    isRefetching,
  } = api.media.findAll.useQuery({
    search: q as string,
    category: category as string,
    page: activePage,
    limit,
  });

  useEffect(() => {
    refetch();
    handleSetPage(1);
  }, [q, category]);

  //Back-End ээс мэдээний нийт тоо ирэхгүй байгаа тул totalPage ийг гараар 10 өглөө.
  //Мөн Онцлох Мэдээний хэсэгийн мэдээнүүдийг filter хийхгүйгээр medias ийн data-г ашиглаж байгаа.

  // const totalPages =
  //   medias && medias?.length > 0 ? Math.ceil(medias?.length / limit) : 0;

  return (
    <div className="flex flex-col gap-9">
      <div className="flex">
        <h6 className="font-semibold text-xl p-[10px] border-b-[3px] border-primary uppercase">
          {categoryName ?? 'Онцлох Мэдээ'}
        </h6>
      </div>
      <MediaList
        medias={medias?.slice(0, 3) as unknown as Media[]}
        isLoading={isLoading || isRefetching}
      />
      <div className="bg-primary-800 w-full h-[476px] md:h-[142px] text-center text-3xl font-bold text-white">
        ad space <br /> 968*142
      </div>
      <div className="flex">
        {!categoryName && (
          <h6 className="font-semibold text-xl p-[10px] border-b-[3px] border-primary uppercase">
            Өдөр Тутам
          </h6>
        )}
      </div>
      <MediaList
        medias={medias?.slice(3, 9) as unknown as Media[]}
        isLoading={isLoading || isRefetching}
      />
      <div className="bg-primary-800 w-full h-[476px] md:h-[142px] text-center text-3xl font-bold text-white md:hidden">
        ad space <br /> 968*142
      </div>
      <div className="mx-auto">
        <Pagination
          value={activePage}
          onChange={handleSetPage}
          total={10}
          radius="xl"
        />
      </div>
    </div>
  );
};
