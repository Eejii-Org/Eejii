import Link from 'next/link';
import {
  Grid,
  Button,
  Image,
  Text,
  BackgroundImage,
  Tabs,
  Center,
  SimpleGrid,
  Group,
} from '@mantine/core';

export const About = () => {
  return (
    <>
      {/* <SimpleGrid cols={{ base: 1, md: 1, lg: 1 }}>
        <Grid justify="center" align="flex-start">
          <SimpleGrid cols={{ base: 1, md: 1, lg: 3 }}>
            <Grid.Col>
              <Text pl={110} c="#3c888d" pt={20} pb={15} fw={700}>
                "Хамгийн агуу сэтгэл бол бусдын төлөө сэтгэл"
              </Text>
              <Text fw={500}>
                Бид хэдий чинээ эрт хамтран ажиллана, төдий чинээ эрт зөв тусыг
                хэрэгтэй хүнд нь <br /> хүргэх, нийгмийн хэт туйлшрал, бэлэнчлэх
                сэтгэлгээ, ядуурал, өвчлөлөөс хүн амыг <br /> хамгаалах
                боломжтой. <br /> Иймд бид НҮТББ, хувь хүн, энэ төрлийн үйл
                ажиллагаа явуулдаг олон улсын салбар <br /> байгууллага, дотоод,
                гадаад сайн дурынхны зохион байгуулдаг хүмүүнлэг болон сайн{' '}
                <br /> үйлсийн аян, төсөл, хөтөлбөрийг нэгтгэсэн Mонголын анхны
                ALL IN ONE олон талт дэмжих <br /> системийг хайр түгээгч та
                бүхэндээ зориулан хөгжүүлж байна. <br /> Уг сангийн одоогийн
                хувилбар нь эцсийн хувилбар биш бөгөөд цаашид та бүхний саналын{' '}
                <br /> дагуу 4 талт оролцогчдод давуу байдлаар тасралтгүй
                хөгжүүлсээр байх болно.
              </Text>
            </Grid.Col>
            <Grid.Col>
              <Image
                radius="md"
                src="/images/about/aboutIMG3.png"
                alt="Random unsplash image"
                className="w-[197px] h-[192px]"
              />
            </Grid.Col>
            <Grid.Col>
              <Image
                radius="md"
                src="/images/about/aboutIMG4.png"
                alt="Random unsplash image"
                className="w-[192px] h-[192px]"
              />
            </Grid.Col>
          </SimpleGrid>
        </Grid>
        <Grid justify="center" align="flex-start" pl={10}>
          <Grid.Col span={1.5} pt={40}>
            <Image
              radius="md"
              src="/images/about/aboutIMG1.png"
              alt="Random unsplash image"
            />
          </Grid.Col>
          <Grid.Col span={2} pt={90}>
            <Image
              radius="md"
              src="/images/about/aboutIMG2.png"
              alt="Random unsplash image"
            />
          </Grid.Col>
          <Grid.Col span={6} pl={50} pt={20}>
            <Text c="#3c888d" pt={20} pb={15} fw={700} ta="center">
              "Сайхан ирээдүйг сайн хүн биш сайн хүмүүс бүтээдэг"
            </Text>
            <Text fw={500} pl={20}>
              Одоогийн хувилбар дээр Дэмжих тал санд байршсан дурын хөтөлбөрийг
              дэмжсэнээр хүмүүнлэгийн модонд мөчир эзэмших ба тухайн модонд таны
              дэмжсэн хөтөлбөрийн <br /> тоогоор навч ургах байдлаар нийгмийн
              хариуцлагаа тодотгуулах түүхчилсэн самбар <br /> эзэмших болно.
              Хамтрагч байгууллагын тухайд өөрийн нэр, логогоор төсөл хөтөлбөрөө
              байршуулж, хандив босгох, өгөх, сургалт, арга хэмжээ зохион
              байгуулахаас гадна <br /> сайн дурын ажилтнуудад хамтарсан
              сертификат, дэмжигчдэдээ талархлын навч өгөх боломжтой. Харин сайн
              дурын ажилчдадаа бид үнэ цэнэтэй сайн дурын ажилд хувь <br />{' '}
              нэмрээ оруулах, олон төрлийн сургалт, лекц, арга хэмжээнд үнэ
              төлбөргүй хамрагдах, <br />
              бие даан хүмүүнлэгийн болон сургалтын арга хэмжээг санаачлан
              зохион байгуулах, XP волунтурын 4 эрэмбэ ахин, үнэ цэнэтэй
              хосолсон сертификаттай болох гэх мэт <br />
              боломжуудыг олгохоор уг санг хөгжүүлж байна.
            </Text>
          </Grid.Col>
        </Grid>
      </SimpleGrid>
      <Text pl={110} c="#3c888d" pt={70} pb={70} fw={500} ta="center" size="lg">
        "Хамгийн агуу сэтгэл бол бусдын төлөө сэтгэл"
      </Text> */}

      {/* <SimpleGrid
        cols={{ base: 1, md: 1, lg: 2 }}
        className="flex flex-col justify-around pt-20 bg-brand450 "
      >
        <div className="h-[264px] w-[741px] text-lg">
          <h2 className="text-center font-bold text-primary">
            "Хамгийн агуу сэтгэл бол бусдын төлөө сэтгэл"
          </h2>
          <p className="pt-5 font-semibold text-brand400">
            {' '}
            Бид хэдий чинээ эрт хамтран ажиллана, төдий чинээ эрт зөв тусыг
            хэрэгтэй хүнд нь <br /> хүргэх, нийгмийн хэт туйлшрал, бэлэнчлэх
            сэтгэлгээ, ядуурал, өвчлөлөөс хүн амыг <br /> хамгаалах боломжтой.{' '}
            <br /> Иймд бид НҮТББ, хувь хүн, энэ төрлийн үйл ажиллагаа явуулдаг
            олон улсын салбар <br /> байгууллага, дотоод, гадаад сайн дурынхны
            зохион байгуулдаг хүмүүнлэг болон сайн <br /> үйлсийн аян, төсөл,
            хөтөлбөрийг нэгтгэсэн Mонголын анхны ALL IN ONE олон талт дэмжих{' '}
            <br /> системийг хайр түгээгч та бүхэндээ зориулан хөгжүүлж байна.{' '}
            <br /> Уг сангийн одоогийн хувилбар нь эцсийн хувилбар биш бөгөөд
            цаашид та бүхний саналын <br /> дагуу 4 талт оролцогчдод давуу
            байдлаар тасралтгүй хөгжүүлсээр байх болно.
          </p>
        </div>
        <div className="flex justify-end">
          <img
            src="/images/about/aboutIMG3.png"
            alt="aboutIMG"
            className="relative right-44 top-5 h-[192px] w-[197px] p-3"
          />
          <img
            src="/images/about/aboutIMG4.png"
            alt="aboutIMG"
            className="relative right-40 top-20 h-[192px] w-[192px] p-3"
          />
        </div>
      </SimpleGrid> */}
      <SimpleGrid
        cols={{ base: 1, md: 1, lg: 2 }}
        className="flex w-full justify-around p-16"
      >
        <div className="text-lg">
          <h2 className="text-primary text-center font-bold">
            "Хамгийн агуу сэтгэл бол бусдын төлөө сэтгэл"
          </h2>
          <p className="text-brand400 flex justify-center pt-5 font-semibold">
            {' '}
            Бид хэдий чинээ эрт хамтран ажиллана, төдий чинээ эрт зөв тусыг
            хэрэгтэй хүнд нь <br /> хүргэх, нийгмийн хэт туйлшрал, бэлэнчлэх
            сэтгэлгээ, ядуурал, өвчлөлөөс хүн амыг <br /> хамгаалах боломжтой.{' '}
            <br /> Иймд бид НҮТББ, хувь хүн, энэ төрлийн үйл ажиллагаа явуулдаг
            олон улсын салбар <br /> байгууллага, дотоод, гадаад сайн дурынхны
            зохион байгуулдаг хүмүүнлэг болон сайн <br /> үйлсийн аян, төсөл,
            хөтөлбөрийг нэгтгэсэн Mонголын анхны ALL IN ONE олон талт дэмжих{' '}
            <br /> системийг хайр түгээгч та бүхэндээ зориулан хөгжүүлж байна.{' '}
            <br /> Уг сангийн одоогийн хувилбар нь эцсийн хувилбар биш бөгөөд
            цаашид та бүхний саналын <br /> дагуу 4 талт оролцогчдод давуу
            байдлаар тасралтгүй хөгжүүлсээр байх болно.
          </p>
        </div>
        <div className="flex h-[300px] justify-center">
          <img
            src="/images/about/aboutIMG3.png"
            alt="aboutIMG"
            className="h-[197px] "
          />
          <img
            src="/images/about/aboutIMG4.png"
            alt="aboutIMG"
            className="relative left-14 top-16 h-[240px]"
          />
        </div>
      </SimpleGrid>
      <SimpleGrid
        cols={{ base: 1, md: 1, lg: 2 }}
        className="flex w-full justify-around p-10"
      >
        <div className="flex h-[300px] justify-center">
          <img
            src="/images/about/aboutIMG1.png"
            alt="aboutIMG"
            className="h-[197px] w-[209px]"
          />
          <img
            src="/images/about/aboutIMG2.png"
            alt="aboutIMG"
            className="relative left-14 top-16 h-[240px] w-[238px] "
          />
        </div>
        <div className="text-lg">
          <h2 className="text-primary text-center font-bold">
            "Сайхан ирээдүйг сайн хүн биш сайн хүмүүс бүтээдэг"
          </h2>
          <p className="text-brand400 flex justify-center pl-10 pt-5 font-semibold">
            {' '}
            Одоогийн хувилбар дээр Дэмжих тал санд байршсан дурын хөтөлбөрийг
            дэмжсэнээр хүмүүнлэгийн модонд мөчир эзэмших ба тухайн модонд таны
            дэмжсэн хөтөлбөрийн <br /> тоогоор навч ургах байдлаар нийгмийн
            хариуцлагаа тодотгуулах түүхчилсэн самбар <br /> эзэмших болно.
            Хамтрагч байгууллагын тухайд өөрийн нэр, логогоор төсөл хөтөлбөрөө
            байршуулж, хандив босгох, өгөх, сургалт, арга хэмжээ зохион
            байгуулахаас гадна <br /> сайн дурын ажилтнуудад хамтарсан
            сертификат, дэмжигчдэдээ талархлын навч өгөх боломжтой. Харин сайн
            дурын ажилчдадаа бид үнэ цэнэтэй сайн дурын ажилд хувь <br /> нэмрээ
            оруулах, олон төрлийн сургалт, лекц, арга хэмжээнд үнэ төлбөргүй
            хамрагдах, <br />
            бие даан хүмүүнлэгийн болон сургалтын арга хэмжээг санаачлан зохион
            байгуулах, XP волунтурын 4 эрэмбэ ахин, үнэ цэнэтэй хосолсон
            сертификаттай болох гэх мэт <br />
            боломжуудыг олгохоор уг санг хөгжүүлж байна.
          </p>
        </div>
      </SimpleGrid>
      <div>
        <h2 className="text-primary pb-16 pt-16 text-center  font-semibold">
          "Хамгийн агуу сэтгэл бол бусдын төлөө сэтгэл"
        </h2>{' '}
      </div>

      {/* second section */}
      <section className="w-full bg-[url('/images/media/firstBG.png')] bg-cover pb-16 pt-16">
        <div>
          <Text fw={700} size="34px" p={10} ta="center">
            Яагаад хураамж төлөх ёстой вэ?
          </Text>
          <Text fw={500} size="md" pt={10} pl={120} pr={120} ta="center">
            {' '}
            Эдгээр хураамжууд нь тус сангийн зар сурталчилгаа, маркетинг, үйл
            ажиллагааны зардал, цалин, татвар хураамж, сайн үйлсийн болон сайн
            дурын хөтөлбөр зэрэг зайлшгүй шаардлагатай зардлыг санхүүжүүлнэ.{' '}
          </Text>
        </div>
        {/* <div className="flex justify-around pt-20">
          <div className="">
            <div className="pb-16">
              <Link href="#">
                <Button className="h-[56px] w-[360px] rounded-xl bg-brand450 text-xl  font-bold text-primary shadow-xl shadow-[#9DC3C6] hover:bg-brand450">
                  Хамтрагч
                </Button>
              </Link>
            </div>

            <div className="m-auto flex h-[706px] w-[329px] flex-col justify-around rounded-xl bg-brand450 text-center before:relative before:h-[39px]  before:w-[5px] before:bg-brand750">
              <h5 className="relative bottom-11 text-2xl font-semibold text-brand750">
                Basic
              </h5>
              <span className="relative bottom-10 flex justify-center text-xl font-bold">
                ₮0/<h2 className="pt-1.5 text-sm text-brand700">1 жил</h2>
              </span>
              <ul className="relative bottom-8 w-[254px] list-disc pl-16 text-start">
                <li>Нэрийн хуудас /Энгийн загвар/</li>
                <li>Хандив өгөх</li>
                <li>Сертификат, тодорхойлолт авах /limited/</li>
                <li>сургалт зохион байгуулах /limited/</li>
                <li>Төсөл оруулах/limited/</li>
                <li>Арга хэмжээ зохион байгуулах/limited/</li>
                <li>Мэдээ оруулах/limited/</li>
                <li>Сайн дурын ажилтан авах/limited/</li>
                <div className="text-brand5">
                  <li>Олон Улсын төсөл</li>
                  <li>VOI CART</li>
                  <li>Онцлох мэдээ</li>
                  <li>Онцлох төсөл</li>
                  <li>Banner хуудас</li>
                  <li>Онцлох хамтрагч</li>
                  <li>Үнэлгээ, сэтгэгдэл</li>
                </div>
              </ul>
              <Link href="#">
                <Button className="relative bottom-5 h-[39px] w-[240px] rounded-xl bg-primarySecond text-lg text-brand450  hover:bg-primarySecond">
                  Гишүүн болох
                </Button>
              </Link>
            </div>
          </div>
          <div className="">
            <div className="pb-16">
              <Link href="#">
                <Button className="h-[56px] w-[360px] rounded-xl bg-brand900 text-xl  font-bold text-primary shadow-xl shadow-[#9DC3C6] hover:bg-brand900">
                  Дэмжигч
                </Button>
              </Link>
            </div>

            <div className="m-auto flex h-[706px] w-[329px] flex-col justify-around rounded-xl bg-brand450 text-center before:relative before:h-[39px]  before:w-[5px] before:bg-brand800">
              <h5 className="relative bottom-11 text-2xl font-semibold text-brand800">
                Preimium
              </h5>
              <span className="relative bottom-10 flex justify-center text-xl font-bold">
                ₮1'000'000/
                <h2 className="pt-1.5 text-sm text-brand700">1 жил</h2>
              </span>
              <ul className="relative bottom-8 w-[254px] list-disc pl-16 text-start">
                <li>Нэрийн хуудас /Энгийн загвар/</li>
                <li>Хандив өгөх</li>
                <li>Сертификат, тодорхойлолт авах /limited/</li>
                <li>сургалт зохион байгуулах /limited/</li>
                <li>Төсөл оруулах/limited/</li>
                <li>Арга хэмжээ зохион байгуулах/limited/</li>
                <li>Мэдээ оруулах/limited/</li>
                <li>Сайн дурын ажилтан авах/limited/</li>
                <div>
                  <li>Олон Улсын төсөл</li>
                  <li>VOI CART</li>
                  <li>Онцлох мэдээ</li>
                  <li>Онцлох төсөл</li>
                  <li>Banner хуудас</li>
                  <li>Онцлох хамтрагч</li>
                  <li>Үнэлгээ, сэтгэгдэл</li>
                </div>
              </ul>
              <Link href="#">
                <Button className="relative bottom-5 h-[39px] w-[240px] rounded-xl bg-primarySecond text-lg text-brand450  hover:bg-primarySecond">
                  Гишүүн болох
                </Button>
              </Link>
            </div>
          </div>
          <div className="">
            <div className="pb-16">
              <Link href="#">
                <Button className="h-[56px] w-[360px] rounded-xl bg-brand900 text-xl  font-bold text-primary shadow-xl shadow-[#9DC3C6] hover:bg-brand900">
                  Сайн дурын ажилтан
                </Button>
              </Link>
            </div>

            <div className="m-auto flex h-[706px] w-[329px] flex-col justify-around rounded-xl bg-brand450 text-center before:relative before:h-[39px]  before:w-[5px] before:bg-brand850">
              <h5 className="relative  bottom-[90px] text-2xl font-semibold text-brand850">
                Pro
              </h5>
              <span className="relative bottom-28 flex justify-center text-xl font-bold">
                On Processing
              </span>
              <ul className="relative bottom-16 left-10  w-[263px] list-disc bg-[url('/images/about/womanBG.png')] object-cover pl-16 text-start">
                <img
                  src="/images/about/woman.png"
                  alt="woman"
                  className="h-[299px] w-[145px]"
                />
              </ul>
              <Link href="#">
                <Button className="relative bottom-0 h-[39px] w-[240px] rounded-xl bg-primarySecond text-lg text-brand450  hover:bg-primarySecond">
                  Гишүүн болох
                </Button>
              </Link>
            </div>
          </div>
        </div> */}
        <Tabs color="#3c888d" defaultValue="partner" pt={40}>
          <Center>
            <Tabs.List>
              <Tabs.Tab value="partner">Хамтрагч</Tabs.Tab>
              <Tabs.Tab value="supporter">Дэмжигч</Tabs.Tab>
            </Tabs.List>
          </Center>

          <Tabs.Panel value="partner">
            <SimpleGrid
              cols={{ base: 1, md: 2, lg: 3 }}
              className="flex w-full justify-around pt-10"
            >
              <div className="bg-brand450 before:bg-brand450 m-auto flex  h-[278px] w-[359px] flex-col justify-around rounded-xl bg-[url('/images/about/blueBG.png')] pt-5  text-center before:relative before:h-[28px] before:w-[4px] before:rounded-sm">
                <h2 className="text-brand450 relative bottom-12 left-7 flex text-3xl font-black">
                  ₮0
                  <h5 className="pl-2 pt-3 text-sm text-gray-200">1 жил</h5>
                </h2>
                <span className="text-brand450 relative bottom-14 left-7 text-start text-xl font-extrabold">
                  Basic Plan
                </span>
                <ul className="text-md relative bottom-14 w-[322px] pl-7 text-start text-gray-200">
                  Та санд төсөл хөтөлбөр болон арга хэмжээ оруулах,сурталчилгаа
                  байршуулах болон өөрийн нэр дээрх хуудсыг хөгжүүлээрэй
                </ul>
                <Link href="#">
                  <Button className="border-1.5 text-brand450 relative bottom-5 right-16 h-[48px] w-[182px] rounded-xl border-[#0356b2] bg-[#0356b2] text-lg font-bold  hover:bg-transparent">
                    Гишүүн болох
                  </Button>
                </Link>
              </div>
              <div className="bg-brand450 before:bg-brand450 m-auto flex  h-[278px] w-[359px] flex-col justify-around rounded-xl bg-[url('/images/about/primaryBG.png')] pt-5  text-center before:relative before:h-[28px] before:w-[4px] before:rounded-sm">
                <h2 className="text-brand450 relative bottom-12 left-7 flex text-3xl font-black">
                  ₮3'000'000
                  <h5 className="pl-2 pt-3 text-sm text-gray-200">1 жил</h5>
                </h2>
                <span className="text-brand450 relative bottom-14 left-7 text-start text-xl font-extrabold">
                  Standart Plan
                </span>
                <ul className="text-md relative bottom-14 w-[322px] pl-7 text-start text-gray-200">
                  Та санд төсөл хөтөлбөр болон арга хэмжээ оруулах,сурталчилгаа
                  байршуулах болон өөрийн нэр дээрх хуудсыг хөгжүүлээрэй
                </ul>
                <Link href="#">
                  <Button className="bg-primary border-1.5 border-primary text-brand450 relative bottom-5 right-16 h-[48px] w-[182px] rounded-xl text-lg font-bold  hover:bg-transparent">
                    Гишүүн болох
                  </Button>
                </Link>
              </div>
              <div className="bg-brand450 before:bg-brand450 m-auto flex  h-[278px] w-[359px] flex-col justify-around rounded-xl bg-[url('/images/about/cyanBG.png')] pt-5  text-center before:relative before:h-[28px] before:w-[4px] before:rounded-sm">
                <h2 className="text-brand450 relative bottom-12 left-7 flex text-3xl font-black">
                  Premium Plan
                </h2>
                <span className="text-brand450 relative bottom-16 left-7 text-start text-xl font-extrabold">
                  Coming soon...
                </span>
                <ul className="height-[101px] relative bottom-12 left-28 flex w-[139px] justify-center bg-[url('/images/about/womanBG.png')] object-cover pr-4 text-start">
                  <img
                    src="/images/about/woman.png"
                    alt="woman"
                    className="h-[100px] w-[116px]"
                  />
                </ul>
                {/* <Link href="#">
                  <Button className="relative right-16 bottom-5 h-[48px] w-[182px] rounded-xl bg-primary font-bold text-lg text-brand450  hover:bg-primarySecond">
                    Гишүүн болох
                  </Button>
                </Link> */}
              </div>
            </SimpleGrid>
          </Tabs.Panel>

          <Tabs.Panel value="supporter">
            <SimpleGrid
              cols={{ base: 1, md: 2, lg: 3 }}
              className="flex w-full justify-around pt-10"
            >
              <div className="bg-brand450 before:bg-brand450 m-auto flex  h-[278px] w-[359px] flex-col justify-around rounded-xl bg-[url('/images/about/cyanBG.png')] pt-5  text-center before:relative before:h-[28px] before:w-[4px] before:rounded-sm">
                <h2 className="text-brand450 relative bottom-12 left-7 flex text-3xl font-black">
                  Premium Plan
                </h2>
                <span className="text-brand450 relative bottom-16 left-7 text-start text-xl font-extrabold">
                  Coming soon...
                </span>

                <ul className="height-[101px] relative bottom-12 left-28 flex w-[139px] justify-center bg-[url('/images/about/womanBG.png')] object-cover pr-4 text-start">
                  <img
                    src="/images/about/woman.png"
                    alt="woman"
                    className="h-[100px] w-[116px]"
                  />
                </ul>
                {/* <Link href="#">
                  <Button className="relative right-16 bottom-5 h-[48px] w-[182px] rounded-xl bg-primary font-bold text-lg text-brand450  hover:bg-primarySecond">
                    Гишүүн болох
                  </Button>
                </Link> */}
              </div>{' '}
              <div className="bg-brand450 before:bg-brand450 m-auto flex  h-[278px] w-[359px] flex-col justify-around rounded-xl bg-[url('/images/about/cyanBG.png')] pt-5  text-center before:relative before:h-[28px] before:w-[4px] before:rounded-sm">
                <h2 className="text-brand450 relative bottom-12 left-7 flex text-3xl font-black">
                  Premium Plan
                </h2>
                <span className="text-brand450 relative bottom-16 left-7 text-start text-xl font-extrabold">
                  Coming soon...
                </span>
                <ul className="height-[101px] relative bottom-12 left-28 flex w-[139px] justify-center bg-[url('/images/about/womanBG.png')] object-cover pr-4 text-start">
                  <img
                    src="/images/about/woman.png"
                    alt="woman"
                    className="h-[100px] w-[116px]"
                  />
                </ul>
                {/* <Link href="#">
                  <Button className="relative right-16 bottom-5 h-[48px] w-[182px] rounded-xl bg-primary font-bold text-lg text-brand450  hover:bg-primarySecond">
                    Гишүүн болох
                  </Button>
                </Link> */}
              </div>
              <div className="bg-brand450 before:bg-brand450 m-auto flex  h-[278px] w-[359px] flex-col justify-around rounded-xl bg-[url('/images/about/cyanBG.png')] pt-5  text-center before:relative before:h-[28px] before:w-[4px] before:rounded-sm">
                <h2 className="text-brand450 relative bottom-12 left-7 flex text-3xl font-black">
                  Premium Plan
                </h2>
                <span className="text-brand450 relative bottom-16 left-7 text-start text-xl font-extrabold">
                  Coming soon...
                </span>
                <ul className="height-[101px] relative bottom-12 left-28 flex w-[139px] justify-center bg-[url('/images/about/womanBG.png')] object-cover pr-4 text-start">
                  <img
                    src="/images/about/woman.png"
                    alt="woman"
                    className="h-[100px] w-[116px]"
                  />
                </ul>
                {/* <Link href="#">
                  <Button className="relative right-16 bottom-5 h-[48px] w-[182px] rounded-xl bg-primary font-bold text-lg text-brand450  hover:bg-primarySecond">
                    Гишүүн болох
                  </Button>
                </Link> */}
              </div>
            </SimpleGrid>
            {/* <section className="flex justify-around pt-14">
              <div className="m-auto flex h-[706px] w-[329px] flex-col justify-around rounded-xl bg-brand450 text-center before:relative before:h-[39px]  before:w-[5px] before:bg-brand750">
                <h5 className="relative bottom-11 text-2xl font-semibold text-brand750">
                  Basic
                </h5>
                <span className="relative bottom-10 flex justify-center text-xl font-bold">
                  ₮0/<h2 className="pt-1.5 text-sm text-brand700">1 жил</h2>
                </span>
                <ul className="relative bottom-8 w-[254px] list-disc pl-16 text-start">
                  <li>Нэрийн хуудас /Энгийн загвар/</li>
                  <li>Хандив өгөх</li>
                  <li>Сертификат, тодорхойлолт авах /limited/</li>
                  <li>сургалт зохион байгуулах /limited/</li>
                  <li>Төсөл оруулах/limited/</li>
                  <li>Арга хэмжээ зохион байгуулах/limited/</li>
                  <li>Мэдээ оруулах/limited/</li>
                  <li>Сайн дурын ажилтан авах/limited/</li>
                  <div className="text-brand5">
                    <li>Олон Улсын төсөл</li>
                    <li>VOI CART</li>
                    <li>Онцлох мэдээ</li>
                    <li>Онцлох төсөл</li>
                    <li>Banner хуудас</li>
                    <li>Онцлох хамтрагч</li>
                    <li>Үнэлгээ, сэтгэгдэл</li>
                  </div>
                </ul>
                <Link href="#">
                  <Button className="relative bottom-5 h-[39px] w-[240px] rounded-xl bg-primarySecond text-lg text-brand450  hover:bg-primarySecond">
                    Гишүүн болох
                  </Button>
                </Link>
              </div>
              <div className="m-auto flex h-[706px] w-[329px] flex-col justify-around rounded-xl bg-brand450 text-center before:relative before:h-[39px]  before:w-[5px] before:bg-brand800">
                <h5 className="relative bottom-11 text-2xl font-semibold text-brand800">
                  Preimium
                </h5>
                <span className="relative bottom-10 flex justify-center text-xl font-bold">
                  ₮1'000'000/
                  <h2 className="pt-1.5 text-sm text-brand700">1 жил</h2>
                </span>
                <ul className="relative bottom-8 w-[254px] list-disc pl-16 text-start">
                  <li>Нэрийн хуудас /Энгийн загвар/</li>
                  <li>Хандив өгөх</li>
                  <li>Сертификат, тодорхойлолт авах /limited/</li>
                  <li>сургалт зохион байгуулах /limited/</li>
                  <li>Төсөл оруулах/limited/</li>
                  <li>Арга хэмжээ зохион байгуулах/limited/</li>
                  <li>Мэдээ оруулах/limited/</li>
                  <li>Сайн дурын ажилтан авах/limited/</li>
                  <div>
                    <li>Олон Улсын төсөл</li>
                    <li>VOI CART</li>
                    <li>Онцлох мэдээ</li>
                    <li>Онцлох төсөл</li>
                    <li>Banner хуудас</li>
                    <li>Онцлох хамтрагч</li>
                    <li>Үнэлгээ, сэтгэгдэл</li>
                  </div>
                </ul>
                <Link href="#">
                  <Button className="relative bottom-5 h-[39px] w-[240px] rounded-xl bg-primarySecond text-lg text-brand450  hover:bg-primarySecond">
                    Гишүүн болох
                  </Button>
                </Link>
              </div>
              <div className="m-auto flex h-[706px] w-[329px] flex-col justify-around rounded-xl bg-brand450 text-center before:relative before:h-[39px]  before:w-[5px] before:bg-brand850">
                <h5 className="relative  bottom-[90px] text-2xl font-semibold text-brand850">
                  Pro
                </h5>
                <span className="relative bottom-28 flex justify-center text-xl font-bold">
                  On Processing
                </span>
                <ul className="relative bottom-16 left-10  w-[263px] list-disc bg-[url('/images/about/womanBG.png')] object-cover pl-16 text-start">
                  <img
                    src="/images/about/woman.png"
                    alt="woman"
                    className="h-[299px] w-[145px]"
                  />
                </ul>
                <Link href="#">
                  <Button className="relative bottom-0 h-[39px] w-[240px] rounded-xl bg-primarySecond text-lg text-brand450  hover:bg-primarySecond">
                    Гишүүн болох
                  </Button>
                </Link>
              </div>
            </section> */}
          </Tabs.Panel>
        </Tabs>
      </section>

      <SimpleGrid
        cols={{ base: 1, md: 1, lg: 1 }}
        className="bg-brand450 flex w-full  flex-col justify-around pb-24 pl-20 pr-20 pt-24"
      >
        <Group justify="flex-start" gap="xl">
          <div className="flex justify-end">
            <div>
              <img
                src="/images/about/AboutFam1.png"
                alt="all in one"
                className=""
              />
            </div>
            <div className="flex h-[152px] w-[511px] flex-col justify-center pl-10">
              <h1 className="h-[32px] text-2xl font-bold">
                Бүгдийг нэг дороос
              </h1>
              <p className="text-md text-brand400 h-[72px] pt-3 font-semibold">
                is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book
              </p>
            </div>
          </div>
        </Group>
        <Group justify="flex-end" gap="xl">
          <div className="flex justify-end">
            <div className="flex h-[152px] w-[511px] flex-col justify-center pr-10">
              <h1 className="h-[32px] text-2xl font-bold">
                Таны дэмжлэгийг бид үнэлнэ
              </h1>
              <p className="text-md text-brand400 h-[72px] pt-3 font-semibold">
                is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book
              </p>
            </div>
            <div>
              <img
                src="/images/about/AboutFam2.png"
                alt="all in one"
                className=""
              />
            </div>
          </div>
        </Group>
        <Group justify="flex-start" gap="xl">
          <div className="flex justify-end">
            <div>
              <img
                src="/images/about/AboutFam3.png"
                alt="all in one"
                className=""
              />
            </div>
            <div className="flex h-[152px] w-[511px] flex-col justify-center pl-10">
              <h1 className="h-[32px] text-2xl font-bold">
                Эерэг бүхнийг түгээе
              </h1>
              <p className="text-md text-brand400 h-[72px] pt-3 font-semibold">
                is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book
              </p>
            </div>
          </div>
        </Group>
        <Group justify="flex-end" gap="xl">
          <div className="flex justify-end">
            <div className="flex h-[152px] w-[511px] flex-col justify-center pr-10">
              <h1 className="h-[32px] text-2xl font-bold">
                Илүү ихийг хамтдаа бүтээцгээе
              </h1>
              <p className="text-md text-brand400 h-[72px] pt-3 font-semibold">
                is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book
              </p>
            </div>
            <div>
              <img
                src="/images/about/AboutFam4.png"
                alt="all in one"
                className=""
              />
            </div>
          </div>
        </Group>
      </SimpleGrid>

      {/* used to mantin ui */}
      {/* <section>
        <div style={{ display: 'flex' }}>
          <AspectRatio ratio={1} style={{ flex: `0 0 ${rem(100)}` }}>
            <Image src="/images/about/AboutFam1.png" alt="about" />
          </AspectRatio>
          <div>
            <Text fw={700} size="md" mt="md">
              Бүгдийг нэг дороос
            </Text>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam,
              officiis! Fugit minus ea, perferendis eum consectetur quae vitae.
              Aliquid, quam reprehenderit? Maiores sed pariatur aliquid commodi
              atque sunt officiis natus?
            </Text>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div>
            <Text fw={700} size="md" mt="md">
              Таны дэмжлэгийг бид үнэлнэ
            </Text>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam,
              officiis! Fugit minus ea, perferendis eum consectetur quae vitae.
              Aliquid, quam reprehenderit? Maiores sed pariatur aliquid commodi
              atque sunt officiis natus?
            </Text>
          </div>
          <AspectRatio ratio={1} style={{ flex: `0 0 ${rem(100)}` }}>
            <Image src="/images/about/AboutFam2.png" alt="about" />
          </AspectRatio>
        </div>
        <div style={{ display: 'flex' }}>
          <AspectRatio ratio={1} style={{ flex: `0 0 ${rem(100)}` }}>
            <Image src="/images/about/AboutFam3.png" alt="about" />
          </AspectRatio>
          <div>
            <Text fw={700} size="lg" mt="md">
              Эерэг бүхнийг түгээе
            </Text>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam,
              officiis! Fugit minus ea, perferendis eum consectetur quae vitae.
              Aliquid, quam reprehenderit? Maiores sed pariatur aliquid commodi
              atque sunt officiis natus?
            </Text>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div>
            <Text fw={500} size="lg" mt="md">
              Илүү ихийг хамтдаа бүтээцгээе
            </Text>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam,
              officiis! Fugit minus ea, perferendis eum consectetur quae vitae.
              Aliquid, quam reprehenderit? Maiores sed pariatur aliquid commodi
              atque sunt officiis natus?
            </Text>
          </div>
          <AspectRatio ratio={1} style={{ flex: `0 0 ${rem(100)}` }}>
            <Image src="/images/about/AboutFam4.png" alt="about" />
          </AspectRatio>
        </div>
      </section> */}
      <BackgroundImage src="/images/media/secondBG.png">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <div
              style={{
                width: 307,
                height: 358,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              className="rounded-md bg-white p-4"
            >
              <Image
                radius="md"
                src="/images/about/goodHuman.png"
                alt="good human"
              />
              <Text fw={500} size="lg" mt="md">
                Be a good human
              </Text>

              <Text mt="xs" c="dimmed" size="sm">
                Сайн дурынхныг хөгжүүлэх хөтөлбөр
              </Text>
            </div>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <div
              style={{
                width: 307,
                height: 358,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              className="rounded-md bg-white p-4"
            >
              <Image radius="md" src="/images/about/wizard.png" alt="wizard" />
              <Text fw={500} size="lg" mt="md">
                12 сарын шидтэн
              </Text>

              <Text mt="xs" c="dimmed" size="sm">
                Хорт хавдартай хүүхдүүдэд шинэ жилийн баяр зохион байгуулдаг аян
              </Text>
            </div>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <div
              style={{
                width: 307,
                height: 358,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              className="rounded-md bg-white p-4"
            >
              <Image radius="md" src="/images/about/warm.png" alt="warm" />
              <Text fw={500} size="lg" mt="md">
                Дулаан өвөлжөөрэй
              </Text>

              <Text mt="xs" c="dimmed" size="sm">
                Амжиргааны түвшин доогуур хүүхдүүдэд туслах сайн үйлсийн аян
              </Text>
            </div>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <div
              style={{
                width: 307,
                height: 358,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              className="rounded-md bg-white p-4"
            >
              <Image radius="md" src="/images/about/dream.png" alt="dream" />
              <Text fw={500} size="lg" mt="md">
                Надад мөрөөдөл бий
              </Text>

              <Text mt="xs" c="dimmed" size="sm">
                Сайн дурынхны чөлөөт өдөрлөг
              </Text>
            </div>
          </Grid.Col>
        </Grid>
      </BackgroundImage>
    </>
  );
};
