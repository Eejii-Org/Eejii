import { ProjectStatus, ProjectType } from '@/lib/db/enums';
import { api } from '@/utils/api';
import Link from 'next/link';
import { Skeleton } from '../skeleton';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useRef, useState } from 'react';

export const FeaturedProjects = () => {
  const { data: featuredProjects, isLoading } = api.project.findAll.useQuery({
    featured: true,
    limit: 5,
    status: ProjectStatus.APPROVED,
    type: ProjectType.FUNDRAISING,
    page: 1,
  });
  const [index, setIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLSelectElement>(null);
  const scrollToPosition = (position: 'left' | 'right') => {
    const projectsLength = featuredProjects?.items?.length || 0;
    if (
      (position == 'right' && index == projectsLength - 1) ||
      (position == 'left' && index == 0)
    ) {
      return;
    }
    setIndex(position == 'right' ? index + 1 : index - 1);
    // const scrollWidth = scrollContainerRef.current?.scrollWidth || 0;
    const scrollLeft = scrollContainerRef.current?.scrollLeft || 0;
    const cardWidth = scrollContainerRef.current?.clientWidth || 0;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left:
          position == 'left'
            ? scrollLeft - cardWidth - 32
            : scrollLeft + cardWidth + 32,
        behavior: 'smooth',
      });
    }
  };
  if (isLoading) {
    return <Skeleton className="h-[360px] rounded-2xl w-full" />;
  }
  return (
    <>
      {featuredProjects ? (
        <div className="relative">
          <section
            ref={scrollContainerRef}
            className="h-[360px] flex overflow-x-scroll snap-x snap-mandatory no-scrollbar gap-8"
          >
            {featuredProjects.items.map((project, i) => (
              <div
                key={i}
                className="relative h-full w-full bg-primary rounded-2xl text-center items-center py-[60px] px-[46px] snap-always snap-center"
                style={{
                  minWidth: scrollContainerRef.current?.clientWidth,
                }}
              >
                <h2 className="text-lg font-semibold mb-1">
                  {project?.Categories[0]?.name}
                </h2>
                <h1 className="pb-12 text-3xl font-semibold">
                  {project.title}
                </h1>
                <Link
                  href={`/projects/${project.slug}`}
                  className="bg-primary-800 px-7 py-4 font-semibold text-[14px] rounded"
                >
                  Хандив өгөх
                </Link>
              </div>
            ))}
          </section>
          <button
            onClick={() => scrollToPosition('left')}
            className={`absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/40 flex justify-center text-center items-center p-2 ${index == 0 ? 'opacity-20' : ''}`}
          >
            <IconChevronLeft className="w-[20px] h-[20px]" />
          </button>
          <button
            onClick={() => scrollToPosition('right')}
            className={`absolute top-1/2 right-3 -translate-y-1/2  rounded-full bg-white/40 flex justify-center text-center items-center p-2 ${index == featuredProjects?.items.length - 1 ? 'opacity-20' : ''}`}
          >
            <IconChevronRight className="w-[20px] h-[20px]" />
          </button>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};
