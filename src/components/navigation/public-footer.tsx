import Link from 'next/link';
import { IconBrandFacebook, IconBrandInstagram } from '@tabler/icons-react';
import Image from 'next/image';

export const PublicFooter = () => {
  const FooterItems = [
    {
      label: 'Шуурхай холбоос',
      links: [
        { link: '/projects', label: 'Төсөл хөтөлбөрүүд' },
        { link: '/events', label: 'Арга Хэмжээ' },
        { link: '/volunteering', label: 'Сайн дурын ажил' },
        { link: '/media', label: 'Медиа' },
        { link: '/about', label: 'Бидний тухай' },
      ],
    },
    {
      label: 'Үйлчилгээ',
      links: [
        { link: '/supporters', label: 'Дэмжигч' },
        { link: '/partners', label: 'Хамтрагч' },
        { link: '/volunteers', label: 'Сайн дурын ажилтан' },
      ],
    },
    {
      label: 'Холбогдох',
      links: [
        { link: '#', label: '+9757714-1001' },
        { link: '#', label: 'info@eejii.org' },
        { link: '#', label: 'volunteermongolia.com', target: '_blank' },
        {
          link: 'https://maps.app.goo.gl/nMybb9Xa8o5BiRkM9',
          label:
            'Монгол Улс, Улаанбаатар хот, Сүхбаатар дүүрэг, Express Tower нэгдүгээр давхар, ',
          target: '_blank',
          leading: '6',
        },
      ],
    },
  ];

  const mapItems = FooterItems.map(item => {
    const mapLinks = item.links.map(link => (
      <Link
        href={link.link}
        target={link?.target}
        key={link.label}
        className={`block leading-${link.leading}`}
      >
        {link.label}
      </Link>
    ));

    return (
      <div
        key={item.label}
        className={`leading-9 ${item.label == 'Холбогдох' && 'hidden md:block'}`}
      >
        <h6 className="pb-4 md:text-[18px] font-bold uppercase text-black">
          {item.label}
        </h6>
        {mapLinks}
        {item.label == 'Шуурхай холбоос' && (
          <div className="border-b-2 border-black/2 w-[130px] mx-auto md:hidden pt-6"></div>
        )}
      </div>
    );
  });

  return (
    <footer className="bg-[#F2F2F2]">
      <div className="container pt-[24px] md:pt-[90px] pb-[65px]">
        <div className="grid text-black/70 md:grid-cols-2 lg:grid-cols-4 gap-[24px] md:gap-[84px] text-center md:text-left">
          <div className="mx-auto md:m-0">
            <Image
              src="/images/logo/World Full Of Love.png"
              width={179}
              height={179}
              alt="mainLogo"
            />
          </div>
          {mapItems}
        </div>
        <div>
          <div className="flex items-center justify-center pb-[40px] pt-[80px] md:pt-[170px]">
            <Link
              href="https://www.facebook.com/eejii.org"
              target="_blank"
              className="bg-brand400 fill-brand450 text-brand450 rounded-full border border-transparent p-[4px]"
            >
              <IconBrandFacebook width={30} height={30} />
            </Link>
            <Link
              href="https://www.instagram.com/mother_project_mn?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              className="bg-brand400 text-brand450 rounded-full p-[4px]"
            >
              <IconBrandInstagram width={30} height={30} />
            </Link>
          </div>

          <div className="text-center">
            <p className="text-md text-black/50">
              Энэхүү сан нь ❤ “ЭЭЖИЙ ЕРТӨНЦ” НҮТББ-ын өмч бөгөөд бүх эрх ©
              хуулиар хамгаалагдсан болно
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
