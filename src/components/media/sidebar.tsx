import { api } from '@/utils/api';
import { useRouter } from 'next/router';
import { Skeleton } from '../skeleton';
import Link from 'next/link';

const SidebarAds = () => {
  return (
    <div className="w-full md:flex flex-col gap-16 text-3xl font-bold text-white hidden">
      <div className="bg-primary-800 w-full h-[806px] text-center">
        ad space <br /> 296*806
      </div>
      <div className="bg-primary-800 w-full h-[266px]">
        {' '}
        ad space <br /> 296*266
      </div>
      <div className="bg-primary-800 w-full h-[266px]">
        {' '}
        ad space <br /> 296*266
      </div>
    </div>
  );
};

const CategoryList = () => {
  const router = useRouter();
  const category = router.query.category ?? '';

  const { data: categories, isLoading } =
    api.category.getMediaCategories.useQuery();

  if (isLoading) {
    return (
      <div className="gap-6 w-full">
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
      </div>
    );
  }
  return (
    <div className="w-full pr-2">
      <h5 className="text-2xl font-semibold max-md:hidden">Мэдээ</h5>
      <div className="flex md:flex-col gap-2 md:divide-y-[1px] no-scrollbar max-md:overflow-x-auto">
        {categories && categories.length > 0
          ? categories.slice(0, 5).map((c, i) => (
              <Link
                className={`md:pt-5 max-md:p-2 text-lg bg-black/5 md:bg-inherit md:font-semibold rounded ${c.id === category ? 'max-md:bg-primary text-white md:text-primary' : ''}`}
                key={i}
                href={{
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    category: c.id,
                    categoryName: c.Category?.name,
                  },
                }}
              >
                {c.Category?.name}
              </Link>
            ))
          : 'No category'}
      </div>
    </div>
  );
};

export function MediaSidebar() {
  return (
    <div className="flex flex-col gap-16 md:w-[296px]">
      <CategoryList />
      <SidebarAds />
    </div>
  );
}
