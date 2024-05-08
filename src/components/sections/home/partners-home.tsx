import Image from 'next/image';

export default function PartnersHome() {
  const partnersLogo: any = [
    { name: 'M Trip', src: '/images/partner/mtrip.png', height: 50 },
    {
      name: 'TTR Mongolia',
      src: '/images/partner/ttrmongolialogo.png',
      height: 50,
    },
    {
      name: 'Gegeenten Cinema',
      src: '/images/partner/gegeentencinema2.png',
      height: 50,
    },
    { name: 'Pick Pack', src: '/images/partner/pickpack.png', height: 50 },
    { name: 'M Trip', src: '/images/partner/mtrip.png', height: 50 },
    {
      name: 'TTR Mongolia',
      src: '/images/partner/ttrmongolialogo.png',
      height: 50,
    },
    {
      name: 'Gegeenten Cinema',
      src: '/images/partner/gegeentencinema2.png',
      height: 50,
    },
    { name: 'Pick Pack', src: '/images/partner/pickpack.png', height: 50 },
    { name: 'M Trip', src: '/images/partner/mtrip.png', height: 50 },
    {
      name: 'TTR Mongolia',
      src: '/images/partner/ttrmongolialogo.png',
      height: 50,
    },
    {
      name: 'Gegeenten Cinema',
      src: '/images/partner/gegeentencinema2.png',
      height: 50,
    },
    { name: 'Pick Pack', src: '/images/partner/pickpack.png', height: 50 },
    { name: 'M Trip', src: '/images/partner/mtrip.png', height: 50 },
    {
      name: 'TTR Mongolia',
      src: '/images/partner/ttrmongolialogo.png',
      height: 50,
    },
    {
      name: 'Gegeenten Cinema',
      src: '/images/partner/gegeentencinema2.png',
      height: 50,
    },
    { name: 'Pick Pack', src: '/images/partner/pickpack.png', height: 50 },
  ];

  return (
    <div className="container py-12 flex flex-col justify-start items-center gap-12 md:gap-16 overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
      <div className="font-semibold text-2xl md:text-4xl">Манай хамрагчид</div>

      <div className="flex items-center justify-center gap-16 [&_img]:max-w-none animate-infinite-scroll">
        {partnersLogo && partnersLogo.length > 0 ? (
          partnersLogo.map((partner: any, i: number) => (
            <Image
              key={i}
              src={partner.src}
              alt={partner.name}
              height={partner.height}
              width={100}
              className={`saturate-0 object-contain w-fit h-[${partner.height}px]`}
            />
          ))
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
