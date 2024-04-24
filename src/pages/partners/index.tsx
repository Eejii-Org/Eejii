import PublicLayout from '@/components/layout/public-layout';
import {
  SimpleGrid,
  Text,
  Skeleton,
  Container,
  Space,
  BackgroundImage,
  Title,
  Button,
  Stack,
} from '@mantine/core';
import { api } from '@/utils/api';
import type { User } from '@/lib/types';
import { PlanTypes } from '@/lib/types';
import { PartnerCard } from '@/components/card/partner-card';
import { FallbackImage } from '@/components/common/fallback-image';

export default function Index() {
  const { data: banner } = api.banner.findAll.useQuery({
    positionCode: 'partners_banner_image',
    limit: 1,
  });
  const partnersBanner = banner
    ? process.env.NEXT_PUBLIC_AWS_PATH + '/' + banner.banners[0]?.path
    : '';

  const { data: basicPartners, isLoading: isBasicLoading } =
    api.partner.findAll.useQuery({
      plan: PlanTypes.BASIC,
    });
  console.log(basicPartners);
  const { data: standartPartners, isLoading: isStandartLoading } =
    api.partner.findAll.useQuery({
      plan: PlanTypes.STANDART,
    });

  return (
    <PublicLayout>
      <div className="bg-primary flex h-[432px] justify-around">
        <BackgroundImage src="">
          <Stack
            maw={400}
            mx={'auto'}
            align="center"
            justify="center"
            h={'100%'}
          >
            <Title order={1} c={'white'} fz={48}>
              Eejii partners
            </Title>
            <Text c="white" fz={18}>
              Let’s create an earth full of love together
            </Text>
            <Button radius={'lg'} size="lg" color="primary.3">
              Хамтрагч болох
            </Button>
          </Stack>
        </BackgroundImage>
      </div>
      <Container size={'xl'}>
        <SimpleGrid cols={{ base: 1, sm: 1, lg: 2 }}>
          <div className="flex flex-col items-start justify-around px-10 py-6 text-start lg:px-20 lg:py-12">
            <h1 className="text-brand400 mb-2 text-3xl font-semibold leading-[46px]">
              Сайхан ирээдүйг сайн хүн биш сайн хүмүүс бүтээдэг
            </h1>
            <p className="text-lg font-semibold italic">
              “Бид нэгдсэнээр зөв тусыг хэрэгтэй хүнд нь хүргэх, нийгмийн хэт
              туйлшрал, бэлэнчлэх сэтгэлгээ, ядуурал, өвчлөлөөс хүн амыг <br />{' '}
              хамгаалан хамтдаа олон талаар хөгжүүлэх боломжтой”
            </p>
            <h2 className="text-lg font-semibold">
              Ананда Диди, Бадамлянхуа асрамжийн төвийн үүсгэн байгуулагч
            </h2>
          </div>
          <div className="">
            <img
              src="/images/partner/partnerAbout.png"
              alt="partnerIMg"
              className="w-full"
            />
          </div>
        </SimpleGrid>
        <div className="m-auto w-[283px]  bg-[#fbfbfb]">
          <h5 className="border-primary border-b-4 pb-2 pt-12 text-center text-2xl font-semibold uppercase">
            Бидний хамтрагчид
          </h5>
        </div>
        <Space h="lg" />
        {!isStandartLoading && standartPartners ? (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={'xl'}>
            {standartPartners.items?.map(sPartner => (
              <PartnerCard
                key={sPartner.id as unknown as string}
                partner={sPartner as unknown as User}
              />
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={'xl'}>
            <Skeleton h={240} w={'100%'} />
            <Skeleton h={240} w={'100%'} />
            <Skeleton h={240} w={'100%'} />
            <Skeleton h={240} w={'100%'} />
            <Skeleton h={240} w={'100%'} />
            <Skeleton h={240} w={'100%'} />
          </SimpleGrid>
        )}
        <div className="bg-[#fbfbfb] pb-20 pt-20">
          <FallbackImage
            height={400}
            width={1200}
            fullWidth
            src={partnersBanner}
            alt=""
          />
        </div>
        {!isBasicLoading && basicPartners ? (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={'xl'}>
            {basicPartners.items.map(bPartner => (
              <PartnerCard
                key={bPartner.id as unknown as string}
                partner={bPartner as unknown as User}
              />
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 3 }}
            className="flex items-center justify-around bg-[#fbfbfb] pt-10"
          >
            <Skeleton h={240} w={'100%'} />
            <Skeleton h={240} w={'100%'} />
            <Skeleton h={240} w={'100%'} />
            <Skeleton h={240} w={'100%'} />
            <Skeleton h={240} w={'100%'} />
            <Skeleton h={240} w={'100%'} />
          </SimpleGrid>
        )}
        <Space h="xl" />
        <section className="w-full bg-[url('/images/media/firstBG.png')] bg-cover pb-16 pt-16">
          <div>
            <div className="m-auto w-[417px] bg-transparent pb-10">
              <h5 className="border-primary border-b-4 pb-2 text-center text-2xl font-semibold uppercase">
                ХЭРХЭН БИДЭНТЭЙ ХАМТРАХ ВЭ?
              </h5>
            </div>
            <Text fw={500} size="md" pt={10} pl={120} pr={120} ta="center">
              {' '}
              Эдгээр хураамжууд нь тус сангийн зар сурталчилгаа, маркетинг, үйл
              ажиллагааны зардал, цалин, татвар хураамж, сайн үйлсийн болон сайн
              дурын хөтөлбөр зэрэг зайлшгүй шаардлагатай зардлыг санхүүжүүлнэ.{' '}
            </Text>
          </div>
          {/* <SimpleGrid */}
          {/*   cols={{ base: 1, md: 2, lg: 3 }} */}
          {/*   className="flex w-full justify-around pt-10" */}
          {/* > */}
          {/*   <div className="m-auto flex h-[278px] w-[359px]  flex-col justify-around rounded-xl bg-brand450 text-center before:relative before:h-[28px]  before:w-[4px] before:bg-brand450 before:rounded-sm pt-5 bg-[url('/images/about/blueBG.png')]"> */}
          {/*     <h2 className="relative flex bottom-12 left-7 text-3xl font-black text-brand450"> */}
          {/*       ₮0 */}
          {/*       <h5 className="pl-2 pt-3 text-sm text-gray-200">1 жил</h5> */}
          {/*     </h2> */}
          {/*     <span className="relative bottom-14 left-7 text-start text-xl font-extrabold text-brand450"> */}
          {/*       Basic Plan */}
          {/*     </span> */}
          {/*     <ul className="relative bottom-14 w-[322px] text-md pl-7 text-start text-gray-200"> */}
          {/*       Та санд төсөл хөтөлбөр болон арга хэмжээ оруулах,сурталчилгаа */}
          {/*       байршуулах болон өөрийн нэр дээрх хуудсыг хөгжүүлээрэй */}
          {/*     </ul> */}
          {/*     <Link href="#"> */}
          {/*       <Button className="relative right-16 bottom-5 h-[48px] w-[182px] rounded-xl bg-[#0356b2] border-1.5 border-[#0356b2] font-bold text-lg text-brand450  hover:bg-[#0356b2]"> */}
          {/*         Гишүүн болох */}
          {/*       </Button> */}
          {/*     </Link> */}
          {/*   </div> */}
          {/*   <div className="m-auto flex h-[278px] w-[359px]  flex-col justify-around rounded-xl bg-brand450 text-center before:relative before:h-[28px]  before:w-[4px] before:bg-brand450 pt-5 before:rounded-sm bg-[url('/images/about/primaryBG.png')]"> */}
          {/*     <h2 className="relative flex bottom-12 left-7 text-3xl font-black text-brand450"> */}
          {/*       ₮3'000'000 */}
          {/*       <h5 className="pl-2 pt-3 text-sm text-gray-200">1 жил</h5> */}
          {/*     </h2> */}
          {/*     <span className="relative bottom-14 left-7 text-start text-xl font-extrabold text-brand450"> */}
          {/*       Standart Plan */}
          {/*     </span> */}
          {/*     <ul className="relative bottom-14 w-[322px] text-md pl-7 text-start text-gray-200"> */}
          {/*       Та санд төсөл хөтөлбөр болон арга хэмжээ оруулах,сурталчилгаа */}
          {/*       байршуулах болон өөрийн нэр дээрх хуудсыг хөгжүүлээрэй */}
          {/*     </ul> */}
          {/*     <Link href="#"> */}
          {/*       <Button className="relative right-16 bottom-5 h-[48px] w-[182px] rounded-xl bg-primary border-1.5 border-primary font-bold text-lg text-brand450  hover:bg-primary"> */}
          {/*         Гишүүн болох */}
          {/*       </Button> */}
          {/*     </Link> */}
          {/*   </div> */}
          {/*   <div className="m-auto flex h-[278px] w-[359px]  flex-col justify-around rounded-xl bg-brand450 text-center before:relative before:h-[28px]  before:w-[4px] before:bg-brand450 pt-5 before:rounded-sm bg-[url('/images/about/cyanBG.png')]"> */}
          {/*     <h2 className="relative flex bottom-12 left-7 text-3xl font-black text-brand450"> */}
          {/*       Premium Plan */}
          {/*     </h2> */}
          {/*     <span className="relative bottom-16 left-7 text-start text-xl font-extrabold text-brand450"> */}
          {/*       Coming soon... */}
          {/*     </span> */}
          {/*     <ul className="relative bottom-12 left-28 flex justify-center w-[139px] height-[101px] bg-[url('/images/about/womanBG.png')] object-cover pr-4 text-start"> */}
          {/*       <img */}
          {/*         src="/images/about/woman.png" */}
          {/*         alt="woman" */}
          {/*         className="h-[100px] w-[116px]" */}
          {/*       /> */}
          {/*     </ul> */}
          {/*   </div> */}
          {/* </SimpleGrid> */}
        </section>
      </Container>
    </PublicLayout>
  );
}
