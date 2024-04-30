import Image from 'next/image';
import React from 'react';

const Card = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactElement;
  title: string;
  description: string;
}) => {
  return (
    <div className=" flex flex-col flex-1 md:max-w-80 h-full items-center justify-center text-center gap-3 bg-white border border-primary border-opacity-50 p-4 md:p-6 rounded-2xl shadow-primary/20 shadow-md">
      <div className="w-[80px] h-[80px] md:w-32 md:h-32 relative">{icon}</div>
      <div className=" font-bold text-xl">{title}</div>
      <div className="text-black/80">{description}</div>
    </div>
  );
};

export default function UsertypeExplain() {
  const cardData = [
    {
      title: 'Сайн дурын ажилтан',
      description: `Та өөрийн ур чадвар,хүсэл сонирхолд тулгуурлан санд байршуулсан сайн дурын хөтөлбөрүүдэд оролцож үнэ цэнэтэй сертификаттай болж, үнэгүй сургалтанд хамрагдаарай.`,
      icon: (
        <Image
          src="/images/volunteer/volunteer_logo.png"
          alt="volunteer"
          className="object-contain"
          fill
        />
      ),
    },
    {
      title: 'Хамтрагч',
      description: `Та мэдээ, төсөл, хөтөлбөрүүдээ энд байршуулснаар олон нийт, дэмжигчид,сайн дурын ажилтнуудад цаг алдалгүй хүргэж,хандив болон бусад олон төрлийн дэмжлэг аваарай.`,
      icon: (
        <Image
          src="/images/partner/partner_logo.png"
          alt="partner"
          className="object-contain"
          fill
        />
      ),
    },
    {
      title: 'Дэмжигч',
      description: `Та санд байршсан дурын төсөл хөтөлбөрүүдийг дэмжин, өөрийн нэрийн нийгмийн хариуцлагийг тодотгох түүхчилсэн самбар эзэмшээрэй.`,
      icon: (
        <Image
          src="/images/supporter/supporter_logo.png"
          alt="supporter"
          className="object-contain"
          fill
        />
      ),
    },
  ];
  return (
    <div className="bg-primary/20 py-[44px] md:py-16">
      <div className="md:container flex flex-row md:justify-evenly max-md:gap-4 max-md:snap-x max-md:snap-mandatory overflow-x-scroll max-md:px-[18px]">
        {cardData.map((card, index) => (
          <div
            className=" max-md:min-w-[calc(100vw-25vw)] max-md:snap-always max-md:snap-center my-4"
            key={index}
          >
            <Card {...card} />
          </div>
        ))}
      </div>
    </div>
  );
}
