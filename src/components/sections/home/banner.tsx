import { ArrowCirlceUpRight } from '@/components/icons';
import { priceFormat } from '@/lib/utils/price';
import Image from 'next/image';

const Corner = ({
  width = 113.47,
  height = 53,
  color = '#FBFBFB',
  direction = 'right',
}: {
  width?: number;
  height?: number;
  color?: string;
  direction?: 'right' | 'left';
}) => {
  if (direction == 'right') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 114 53"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0V53C0 35.3269 14.3269 21 32 21H96.539C97.4093 21 98.1796 20.4372 98.4443 19.6082L102.038 8.3509C103.626 3.37657 108.248 0 113.469 0H0Z"
          fill={color}
        />
      </svg>
    );
  }
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 114 53"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M113.471 0V53C113.471 35.3269 99.1437 21 81.4705 21H16.9312C16.0609 21 15.2906 20.4372 15.0259 19.6082L11.4325 8.3509C9.84462 3.37657 5.22234 0 0.000707724 0H113.471Z"
        fill={color}
      />
    </svg>
  );
};

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
      <div className="flex-1 flex flex-col justify-between items-center py-16 gap-16">
        <div className="flex flex-col text-center gap-6">
          <h1 className="text-[#245255] text-4xl font-extrabold">
            Хамтдаа <br /> хайр дүүрэн ертөнцийг бүтээе
          </h1>
          <div className="flex flex-col gap-1">
            <p className="text-xl">
              Монгол дахь хүмүүнлэгийн үйл ажиллагаа <br /> болон сайн дурынхныг
              дэмжих сан
            </p>
            <h2 className="text-primary pt-2 text-xl font-bold uppercase">
              All in one
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4 w-full ">
          <div className="flex flex-col gap-4">
            <div>
              <div className="p-3 bg-[#3c888D] rounded-[32px] pt-9 relative rounded-tl-2xl h-80 flex justify-end flex-col gap-6">
                <div className="absolute -right-[0.5px] top-0">
                  <Corner direction="left" />
                </div>
                <div className="flex flex-col gap-1">
                  <h5 className=" text-white font-medium text-[48px]">
                    {volunteersPercentage}%
                  </h5>
                  <p className="font-semibold text-white">
                    Манай нийт <br /> оролцогчдын {volunteersPercentage} хувийг
                    <br /> нь сайн дурын ажилчид эзэлж байна
                  </p>
                </div>

                <button className="w-full flex flex-row items-center justify-between p-2 pl-5 bg-black/15 rounded-[20px]">
                  <div className="font-semibold text-md text-white">
                    Бидэнтэй нэгдэх
                  </div>
                  <ArrowCirlceUpRight color="#BFE88C" />
                </button>
              </div>
            </div>
            <div className="p-3 bg-[#1B2B2C] rounded-[32px] py-8 flex items-center">
              <div className="relative h-14 min-w-14">
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
          <div className="flex items-end justify-end">
            <div className="p-3 rounded-[32px] pt-9 pb-8 relative h-80 flex items-end w-full">
              <div className="absolute -right-[0.5px] top-0 z-30">
                <Corner direction="left" />
              </div>
              <div className="text-white text-xl text-left font-bold z-20">
                Нийт {totalVolunteeringEvents}+ cайн
                <br />
                дурын ажлууд
              </div>
              <Image
                src="/images/home/folderLeftIMG1.png"
                className="z-0 object-cover rounded-[32px]"
                fill
                alt="folderLeftImg"
              />
            </div>
          </div>
          <div className="flex items-end">
            <div className="p-3 bg-[#E8E8E8] rounded-[32px] h-64 flex flex-col w-full">
              <div className="flex flex-1 justify-center items-center">
                <p className="font-bold text-lg text-center">
                  Бид нийт {priceFormat(totalDonations, 'MNT')} төгрөгийн хандив
                  цуглуулжээ
                </p>
              </div>

              <button className="flex flex-row  items-center justify-between p-2 pl-5 bg-black/15 rounded-[20px]">
                <div className="font-semibold text-md">Хандив өгөх</div>
                <ArrowCirlceUpRight />
              </button>
            </div>
          </div>
          <div className="flex items-end justify-end">
            <div className="p-3 rounded-[32px] pt-9 pb-8 relative h-80 flex items-end w-full">
              <div className="absolute left-0 top-0 z-30">
                <Corner direction="right" />
              </div>
              <div className="text-white text-xl text-left font-bold z-20">
                Нийт {totalProjects}+ төсөл хөтөлбөрүүд
              </div>
              <Image
                src="/images/home/folderRightIMG1.png"
                className="z-0 object-cover rounded-[32px]"
                fill
                alt="folderLeftImg"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="relative flex flex-col items-end">
              <div className="p-3 bg-[#BFE88C] rounded-[32px] pt-9 relative rounded-tr-2xl h-80 w-full flex flex-col gap-6 justify-end">
                <div className="absolute left-0 top-0">
                  <Corner direction="right" />
                </div>

                <div className="relative flex-1">
                  <Image
                    src="/images/home/folderINimg.png"
                    fill
                    alt="fr-image"
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <p className="text-black/70 font-bold">
                  Энэ сард нийт {thisMonthProjectsAndEvents} төсөл шинээр
                  нэмэгдлээ
                </p>
                <button className="flex flex-row w-full items-center justify-between p-2 pl-5 bg-black/15 rounded-[20px]">
                  <div className="font-semibold text-md">Дэлгэрэнгүй</div>
                  <ArrowCirlceUpRight />
                </button>
              </div>
            </div>

            <div className="p-3 bg-[#245255] rounded-[32px] py-8 flex">
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
