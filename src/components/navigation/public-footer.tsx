import { Container, SimpleGrid } from '@mantine/core';
import Link from 'next/link';
import { api } from '@/utils/api';
import { IconBrandFacebook, IconBrandInstagram } from '@tabler/icons-react';

export const PublicFooter = () => {
  const { data: bannerLogo } = api.banner.findAll.useQuery({
    positionCode: 'banner_main_logo',
    limit: 1,
  });
  const bannerMain = bannerLogo
    ? process.env.NEXT_PUBLIC_AWS_PATH + '/' + bannerLogo.banners[0]?.path
    : '';
  return (
    <div className="container">
      <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} pt={40}>
        <div>
          <img src={bannerMain} alt="mainLogo" />
        </div>
        <div className="leading-9">
          <h6 className="pb-4 text-xl font-bold">Шуурхай холбоос</h6>
          <Link href="#">
            <ul>Төсөл хөтөлбөрүүд</ul>
          </Link>
          <Link href="#">
            <ul>Арга хэмжээ</ul>
          </Link>
          <Link href="#">
            <ul>Сайн дурын ажил</ul>
          </Link>
          <Link href="#">
            <ul>Медиа</ul>
          </Link>
          <Link href="#">
            <ul>Бидний тухай</ul>
          </Link>
        </div>
        <div className="leading-9">
          <h6 className="pb-4 text-xl font-bold">Үйлчилгээ</h6>
          <Link href="#">
            <ul>Дэмжигч</ul>
          </Link>
          <Link href="#">
            <ul>Хамтрагч</ul>
          </Link>
          <Link href="#">
            <ul>Сайн дурын ажилтан</ul>
          </Link>
        </div>
        <div className="leading-9">
          <h6 className="pb-4 text-xl font-bold">Холбогдох</h6>
          <Link href="#">
            <ul>Сүхбаатар дүүрэг, express tower нэгдүгээр давхар</ul>
          </Link>
          <Link href="#">
            <ul>Монгол улс,Улаанбаатар хот</ul>
          </Link>
          <Link href="#">
            <ul>+975 7714-1001</ul>
          </Link>
          <Link href="#">
            <ul>info@eejii.org</ul>
          </Link>
          <Link href="#">
            <ul>volunteermongolia.com</ul>
          </Link>
        </div>
      </SimpleGrid>
      <div>
        <div className="m-auto flex w-24 items-center justify-between pb-9 pt-20">
          <Link
            href="#"
            className="bg-brand400 fill-brand450 text-brand450 rounded-full border border-transparent p-1.5"
          >
            <IconBrandFacebook />
          </Link>
          <Link
            href="#"
            className="bg-brand400 text-brand450 rounded-full p-1.5"
          >
            <IconBrandInstagram />
          </Link>
        </div>

        <div className="h-16 text-center">
          <p>
            Энэхүү сан нь ❤ “ЭЭЖИЙ ЕРТӨНЦ” НҮТББ-ын өмч бөгөөд бүх эрх ©
            хуулиар хамгаалагдсан болно
          </p>
        </div>
      </div>
    </div>
  );
};
