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
      <div className="container sticky z-10">
        <div className="font-bold text-5xl">Бидний сүүлийн үеийн төслүүд</div>
        <div className="pt-4 flex flex-row justify-between">
          <div className="text-black/50 font-semibold text-xl">
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
        <div className="flex flex-row gap-16 pt-8">
          {latestProjects?.items.map((project, index) => (
            <Card
              cardData={project}
              cardSize="large"
              cardType="project"
              categoryVisible
              contain
              loading={isLoading}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestProjects;
