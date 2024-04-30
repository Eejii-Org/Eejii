import Image from 'next/image';

export default function PartnersHome() {
  return (
    <div className="container py-12 flex flex-col justify-start items-center gap-12">
      <div className="font-semibold text-2xl md:text-4xl">Манай хамрагчид</div>
      <div className="flex flex-row items-center gap-8">
        <Image
          src="/images/partner/partner1.png"
          alt="airTour"
          height={100}
          width={200}
          className="object-contain"
        />
        <Image
          height={80}
          width={120}
          src="/images/partner/partner2.png"
          alt="ttr"
          className="object-contain"
        />
        <Image
          height={80}
          width={80}
          src="/images/partner/partner3.png"
          alt="Lotus"
          className="object-contain"
        />
      </div>
    </div>
  );
}
