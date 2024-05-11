import { Skeleton } from '@/components/skeleton';
import type { Country } from '@/lib/db/types';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const MapChart = dynamic(() => import('@/components/common/map'), {
  ssr: false,
});

export default function VolunteersMap({
  level_1,
  level_2,
  level_3,
  level_4,
  countries,
  isLoading,
}: {
  level_1: number;
  level_2: number;
  level_3: number;
  level_4: number;
  countries?: Country[];
  isLoading: boolean;
}) {
  return (
    <div className="container md:pt-16 flex flex-col md:gap-16 items-center">
      <div className="flex flex-row items-center justify-center">
        <div className="flex flex-row md:gap-16 max-md:justify-evenly gap-9 max-md:grid max-md:grid-cols-2">
          <div className="flex flex-col gap-2 items-center">
            <Image
              width={80}
              height={80}
              className="md:h-[80px] md:w-[80px] w-[110px] h-[110px]"
              src="/images/volunteer_level/level_4.png"
              alt="levelIMG"
            />
            {isLoading ? (
              <Skeleton className="h-5 w-full" />
            ) : (
              <div className={`md:text-2xl font-medium`}>
                {level_4} Volunteers
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Image
              width={80}
              height={80}
              className="md:h-[80px] md:w-[80px] w-[110px] h-[110px]"
              src="/images/volunteer_level/level_3.png"
              alt="levelIMG"
            />
            {isLoading ? (
              <Skeleton className="h-5 w-full" />
            ) : (
              <div className="md:text-2xl font-medium">
                {level_3} Volunteers
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Image
              width={80}
              height={80}
              className="md:h-[80px] md:w-[80px] w-[110px] h-[110px]"
              src="/images/volunteer_level/level_2.png"
              alt="levelIMG"
            />
            {isLoading ? (
              <Skeleton className="h-5 w-full" />
            ) : (
              <div className="md:text-2xl font-medium">
                {level_2} Volunteers
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Image
              width={80}
              height={80}
              className="md:h-[80px] md:w-[80px] w-[110px] h-[110px]"
              src="/images/volunteer_level/level_1.png"
              alt="levelIMG"
            />
            {isLoading ? (
              <Skeleton className="h-5 w-full" />
            ) : (
              <div className="md:text-2xl font-medium">
                {level_1} Volunteers
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="text-2xl md:text-4xl pt-16 md:pt-0 text-black/80 font-bold">
        Дэлхийн өнцөг булан бүрдэх манай сайн дурынхан
      </div>
      {isLoading ? (
        <Skeleton className="w-full h-96 md:h-[576px]" />
      ) : (
        <MapChart countries={countries} />
      )}
    </div>
  );
}
