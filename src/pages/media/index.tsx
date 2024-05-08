import PublicLayout from '@/components/layout/public-layout';
import { PublicMediaList } from '@/components/media/list';
import { MediaSidebar } from '@/components/media/sidebar';
import { IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Index() {
  const [search, setSearch] = useState('');
  const router = useRouter();
  return (
    <PublicLayout>
      <main>
        <div className="container pb-[40px] md:py-[60px]">
          <div className="flex max-md:flex-col gap-5 md:gap-9">
            <div className="w-full">
              <div className="flex justify-between mb-3 md:mb-8 mx-3 px-4 py-5 md:py-5 md:px-6 bg-white shadow-md rounded-full">
                <input
                  className="w-full outline-none text-lg"
                  placeholder="Хайх"
                  onChange={e => {
                    e.preventDefault();
                    setSearch(e.currentTarget.value);
                  }}
                />

                <IconSearch
                  onClick={() => {
                    router.push({
                      pathname: router.pathname,
                      query: { ...router.query, q: search },
                    });
                  }}
                  className="text-primary"
                />
              </div>
              <div className="md:hidden mb-5">
                <MediaSidebar />
              </div>
              <PublicMediaList />
            </div>
            <div className="max-md:hidden">
              <MediaSidebar />
            </div>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
