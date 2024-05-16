import PublicLayout from '@/components/layout/public-layout';
import { FeaturedProjects } from '@/components/list/featured-project-list';
import { ProjectList } from '@/components/list/project-list';
import { ProjectStatus, ProjectType } from '@/lib/db/enums';
import type { Project } from '@/lib/types';
import { api } from '@/utils/api';
import { Pagination } from '@mantine/core';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Index() {
  const router = useRouter();
  const { type, q, page } = router.query;

  const [activePage, setPage] = useState(page ? +page : 1);
  const [search, setSearch] = useState(q);
  const [activeTab, setActiveTab] = useState<string | null>(
    (type as string) ?? ProjectType.FUNDRAISING
  );

  function handleSetPage(value: number) {
    setPage(value);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: value },
    });
  }

  function handleActiveTab(value: string | null) {
    router.push(
      {
        query: { ...router.query, type: value },
      },
      undefined,
      { scroll: false }
    );
    setActiveTab(value);
  }

  const {
    data: projects,
    isLoading,
    refetch,
  } = api.project.findAll.useQuery({
    page: activePage,
    limit: 9,
    enabled: true,
    status: ProjectStatus.APPROVED,
    type: type as ProjectType,
    title: q as string,
  });

  useEffect(() => {
    refetch();
  }, [q]);

  const totalPages = projects?.pagination.totalPages;
  // const { data: banner } = api.banner.findAll.useQuery({
  //   positionCode: 'project_index_banner',
  //   limit: 1,
  // });
  // const bannerImage = banner
  //   ? process.env.NEXT_PUBLIC_AWS_PATH + '/' + banner.banners[0]?.path
  //   : '';
  return (
    <PublicLayout>
      <Image
        width={1600}
        height={400}
        src={'/images/projectss/main.png'}
        alt="main"
        className="w-full"
      />
      <div className="container pb-5">
        <div className="-translate-y-16 grid grid-cols-12 gap-5">
          <div className="col-span-12 md:col-span-7 lg:col-span-8">
            <div className="shadow-md rounded-2xl bg-white py-3 px-3 pt-5 max-md:text-center sm:p-6 mb-16">
              <p className="font-semibold mb-6 text-2xl">
                Та ямар төсөл дэмжихийг хүсч байна вэ?
              </p>
              <div className="flex max-md:flex-col gap-3">
                <input
                  placeholder="Нэр"
                  required
                  defaultValue={q}
                  onChange={e => {
                    e.preventDefault();
                    setSearch(e.currentTarget.value);
                  }}
                  className="rounded-full flex-1 border-[1px] border-black/30 px-5 py-2 md:py-3 text-black/50"
                />
                <button
                  onClick={() =>
                    router.push({
                      pathname: router.pathname,
                      query: { ...router.query, q: search },
                    })
                  }
                  className="rounded-2xl px-9 py-[10px] bg-primary-800 text-black/50 font-medium max-md:rounded-full"
                >
                  Төсөл хайх
                </button>
              </div>
            </div>
            <p className="order-3 text-2xl font-semibold mb-7">Онцгой төсөл</p>
            <FeaturedProjects />
          </div>
          <div className="col-span-12 md:col-span-5 lg:col-span-4">
            <div className="bg-primary text-center items-center h-[200px] md:h-full rounded-3xl">
              <div className="text-4xl font-bold">AD Space 5</div>
            </div>
          </div>
        </div>
        <div className="-translate-y-8">
          <button
            onClick={() => handleActiveTab('FUNDRAISING')}
            className={`px-6 py-3 font-bold text-lg text-primary ${activeTab == 'FUNDRAISING' && 'text-black/12 border-b-2 border-primary'}`}
          >
            Projects
          </button>
          <button
            onClick={() => handleActiveTab('GRANT_FUNDRAISING')}
            className={`px-6 py-3 font-bold text-lg text-primary ${activeTab == 'GRANT_FUNDRAISING' && 'text-black/12 border-b-2 border-primary '}`}
          >
            Grant Projects
          </button>
        </div>
        <div>
          <ProjectList
            projects={projects?.items as Project[]}
            isLoading={isLoading}
          />
        </div>
        <div className="mb-5"></div>
        <div className="w-full flex justify-center">
          <Pagination
            radius="xl"
            value={activePage}
            onChange={handleSetPage}
            total={totalPages ?? 1}
          />
        </div>
      </div>
    </PublicLayout>
  );
}
