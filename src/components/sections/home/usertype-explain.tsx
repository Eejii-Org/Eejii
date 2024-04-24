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
    <div className="flex-1 max-w-80 flex flex-col items-center justify-center text-center gap-3 bg-white border border-primary border-opacity-50 p-6 rounded-2xl">
      <div className=" w-32 h-32 relative">{icon}</div>
      <div className=" font-bold text-xl">{title}</div>
      <div>{description}</div>
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
      description: `Та мэдээ,төсөл,хөтөлбөрүүдээ энд байршуулснаар олон нийт,дэмжигчид,сайн дурын ажилтнуудад цаг алдалгүй хүргэж,хандив болон бусад олон төрлийн дэмжлэг аваарай.`,
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
    <div className="bg-primary/20 py-16">
      <div className="container flex flex-row justify-center gap-16">
        {cardData.map((card, index) => (
          <Card {...card} key={index} />
        ))}
      </div>
    </div>
  );
}
