import { Card } from '@/components/card/card';
import { api } from '@/utils/api';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

export default function MediaSection() {
  const { data, isLoading } = api.media.findAll.useQuery({ limit: 4 });
  console.log(data);
  return (
    <div className="container py-16">
      <div className="font-bold text-5xl">Мэдээ</div>
      <div className="pt-4 flex flex-row justify-between">
        <div className="text-black/50 font-semibold text-xl">
          Сангийн үйл ажиллагааны талаар сүүлийн үеийн мэдээлэлтэй хамтдаа
          байгаарай
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
      <div className="flex flex-row gap-6 pt-8">
        {data?.map((mediaData, index) => (
          <Card
            cardData={mediaData}
            cardType="media"
            loading={isLoading}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}
