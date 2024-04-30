import { ArrowCirlceUpRight } from '@/components/icons';
import { priceFormat } from '@/lib/utils/price';
import Image from 'next/image';

export default function Banner({
  totalProjects,
  totalVolunteeringEvents,
  volunteersPercentage,
  totalDonations,
  thisMonthProjectsAndEvents,
}: {
  totalProjects: number;
  totalVolunteeringEvents: number;
  volunteersPercentage: number;
  totalDonations: number;
  thisMonthProjectsAndEvents: number;
}) {
  // const { data: banner4 } = api.banner.findAll.useQuery({
  //   positionCode: 'home_left_middle',
  //   limit: 1,
  // });
  // // const HomeMiddleLeft = banner4
  // //   ? process.env.NEXT_PUBLIC_AWS_PATH + '/' + banner4.banners[0]?.path
  // //   : '';
  // // const { data: banner5 } = api.banner.findAll.useQuery({
  // //   positionCode: 'home_right_middle',
  // //   limit: 1,
  // // });
  // // const HomeMiddleRight = banner5
  // //   ? process.env.NEXT_PUBLIC_AWS_PATH + '/' + banner5.banners[0]?.path
  // //   : '';
  // console.log(HomeMiddleLeft);
  return (
    <div className="container flex flex-col">
      <div className="flex-1 flex flex-col justify-between items-center text-lg py-11 gap-16 text-center md:text-left">
        <div className="flex flex-col text-center gap-6">
          <h1 className="text-2xl md:text-4xl font-bold text-[#245255]">
            Хамтдаа <br /> хайр дүүрэн ертөнцийг бүтээе
          </h1>
          <div className="flex flex-col gap-1">
            <p className="text-lg md:text-2xl ">
              Монгол дахь хүмүүнлэгийн үйл ажиллагаа <br /> болон сайн дурынхныг
              дэмжих сан
            </p>
            <h2 className="text-primary pt-2 text-lg md:text-2xl font-extrabold uppercase">
              All in one
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full ">
          <div className="flex flex-col gap-4 order-1 md:order-none">
            <div className="">
              <div className="p-3 bg-[#3c888D] bannerMasking -scale-x-100 rounded-[32px] pt-9 relative h-56 md:h-80 flex justify-end flex-col gap-6">
                <div className="flex flex-col gap-1 -scale-x-100">
                  <h5 className=" text-white font-medium text-[48px] hidden md:inline pb-3">
                    {volunteersPercentage}%
                  </h5>
                  <p className="font-semibold md:font-bold text-white">
                    Манай нийт оролцогчдын {volunteersPercentage} хувийг нь сайн
                    дурын ажилчид эзэлж байна
                  </p>
                </div>

                <button className="w-full flex flex-row -scale-x-100 items-center justify-center md:justify-between p-3 md:p-2 bg-black/15 rounded-full">
                  <div className="font-semibold md:pl-5 text-md text-white">
                    Бидэнтэй нэгдэх
                  </div>
                  <div className="hidden md:inline">
                    <ArrowCirlceUpRight color="#BFE88C" />
                  </div>
                </button>
              </div>
            </div>
            <div className="p-3 bg-[#1B2B2C] rounded-[32px] py-8 items-center hidden md:flex">
              <div className="relative h-14 min-w-14 hidden md:block">
                <Image
                  src="/images/home/checkmark.png"
                  className="object-contain"
                  fill
                  alt="fr-image"
                  unoptimized
                />
              </div>
              <h1 className="font-bold text-white text-center flex-1">
                Be a good Human
              </h1>
            </div>
          </div>
          <div className="flex items-end justify-end order-4 md:order-none">
            <div className="p-4 rounded-[32px] pt-9 md:pb-8 relative h-56 md:h-80 flex items-end w-full">
              <div className="text-white text-lg md:text-xl text-left font-semibold md:font-bold z-20">
                Нийт {totalVolunteeringEvents}+ cайн <br /> дурын ажлууд
              </div>
              <Image
                src="/images/home/folderLeftIMG1.png"
                className="z-0 object-cover rounded-[32px] bannerMasking -scale-x-100"
                fill
                alt="folderLeftImg"
              />
            </div>
          </div>
          <div className="flex items-end border-[1px] border-[#3c888D] rounded-[32px] md:border-none col-span-2 md:col-span-1 order-3 md:order-none">
            <div className="p-3 bg-primary-900/20 rounded-[32px] md:h-64 flex flex-col gap-4 w-full">
              <div className="flex flex-1 justify-center items-center text-[#3c888D] md:text-black px-8 md:px-0 py-[8px] md:py-0">
                <p className="font-bold text-lg text-center">
                  Бид нийт {priceFormat(totalDonations, 'MNT')} төгрөгийн хандив
                  цуглуулжээ
                </p>
              </div>

              <button className="flex flex-row items-center justify-center md:justify-between p-3 md:p-2 text-white md:text-black bg-[#3c888D] md:bg-black/15 rounded-full">
                <div className="font-semibold text-md md:pl-5">Хандив өгөх</div>
                <div className="hidden md:inline">
                  <ArrowCirlceUpRight />
                </div>
              </button>
            </div>
          </div>
          <div className="flex items-end justify-end order-5 md:order-none">
            <div className="p-4 rounded-[32px] pt-9 pb-4 md:pb-8 relative h-56 md:h-80 flex items-end w-full">
              <div className="text-white text-lg md:text-xl text-left font-semibold md:font-bold z-20">
                Нийт {totalProjects}+ төсөл хөтөлбөрүүд
              </div>
              <Image
                src="/images/home/folderRightIMG1.png"
                className="z-0 object-cover rounded-[32px] bannerMasking"
                fill
                alt="folderLeftImg"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 order-2 md:order-none">
            <div className="relative flex flex-col items-end">
              <div className="p-3 bg-[#BFE88C] bannerMasking rounded-[32px] relative h-56 md:h-80 w-full flex flex-col gap-3 md:gap-6 justify-between md:justify-end">
                <div className="relative flex-1 ">
                  <Image
                    src="/images/home/folderINimg.png"
                    fill
                    alt="fr-image"
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <p className="text-black/60 font-semibold md:font-bold">
                  Энэ сард нийт {thisMonthProjectsAndEvents} төсөл шинээр
                  нэмэгдлээ
                </p>
                <button className="flex flex-row text-white md:text-black w-full items-center justify-center md:justify-between p-3 md:p-2 bg-black/15 rounded-full">
                  <div className="font-semibold md:pl-5 text-md">
                    Дэлгэрэнгүй
                  </div>
                  <div className="hidden md:inline">
                    <ArrowCirlceUpRight />
                  </div>
                </button>
              </div>
            </div>

            <div className="p-3 bg-[#245255] rounded-[32px] py-8 hidden md:flex">
              <div className="relative h-14 min-w-14">
                <Image
                  src="/images/home/heart.png"
                  className="object-contain"
                  fill
                  alt="fr-image"
                  unoptimized
                />
              </div>
              <h1 className="flex-1 font-bold text-[#BFE88C] text-center">
                Be someone's
                <br />
                hope today
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
