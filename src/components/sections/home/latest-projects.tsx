import { Card } from '@/components/card/card';
import { IconArrowRight } from '@tabler/icons-react';
import { api } from '@/utils/api';
import Link from 'next/link';
import Image from 'next/image';

export const LatestProjects = () => {
  const { data: latestProjects, isLoading } = api.project.findAll.useQuery({
    page: 1,
    limit: 3,
  });
  return (
    <div className="py-16 relative">
      <Image
        src="/images/home/backGroundImg.png"
        fill
        alt="latestProjectsBg"
        className="z-0"
      />
      <div className="md:container flex-col sticky z-10">
        <div className="max-md:container font-bold text-2xl md:text-4xl">
          Бидний сүүлийн үеийн төслүүд
        </div>
        <div className="max-md:container pt-4 flex flex-row justify-between">
          <div className="text-black/50 font-semibold text-xl max-md:hidden">
            Хандивийн төслүүдтэй дэлгэрэнгүй танилцаарай
          </div>
          <Link
            href="/projects"
            className=" text-primary font-bold text-lg flex justify-center items-center gap-2"
          >
            Дэлгэрэнгүй
            <span className="-rotate-45 origin-center">
              <IconArrowRight />
            </span>
          </Link>
        </div>
        <div className="flex max-md:px-16 flex-row gap-16 pt-8 max-md:overflow-x-auto  max-md:snap-x max-md:snap-mandatory max-md:scroll-smooth">
          {latestProjects?.items.map((project, index) => (
            <div
              className="max-md:min-w-[90vw] flex-1 flex max-md:snap-always max-md:snap-center"
              key={index}
            >
              <Card
                cardData={project}
                cardSize="large"
                cardType="project"
                categoryVisible
                contain
                loading={isLoading}
                key={index}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestProjects;
