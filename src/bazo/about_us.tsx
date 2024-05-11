import Link from 'next/link';
import { Image } from '@mantine/core';
import { useState } from 'react';

export const About = () => {
  const [tab, setTab] = useState('partner');

  return (
    <main className="pt-5 md:pt-20 bg-white">
      <section className="container grid gap-20">
        <div className="w-full flex max-md:flex-col justify-start gap-9">
          <div className="text-lg max-md:order-2 md:w-[55%]">
            <p className="text-primary text-center font-bold mb-2">
              "Хамгийн агуу сэтгэл бол бусдын төлөө сэтгэл"
            </p>
            <p className="font-medium">
              Бид хэдий чинээ эрт хамтран ажиллана, төдий чинээ эрт зөв тусыг
              хэрэгтэй хүнд нь хүргэх, нийгмийн хэт туйлшрал, бэлэнчлэх
              сэтгэлгээ, ядуурал, өвчлөлөөс хүн амыг хамгаалах боломжтой. Иймд
              бид НҮТББ, хувь хүн, энэ төрлийн үйл ажиллагаа явуулдаг олон улсын
              салбар байгууллага, дотоод, гадаад сайн дурынхны зохион байгуулдаг
              хүмүүнлэг болон сайн үйлсийн аян, төсөл, хөтөлбөрийг нэгтгэсэн
              Mонголын анхны ALL IN ONE олон талт дэмжих системийг хайр түгээгч
              та бүхэндээ зориулан хөгжүүлж байна. Уг сангийн одоогийн хувилбар
              нь эцсийн хувилбар биш бөгөөд цаашид та бүхний саналын дагуу 4
              талт оролцогчдод давуу байдлаар тасралтгүй хөгжүүлсээр байх болно.
            </p>
          </div>
          <div className="md:w-[45%] flex justify-center gap-10 max-md:order-1">
            <img
              src="/images/about/aboutIMG3.png"
              alt="aboutIMG"
              className="md:h-[192px] h-[140px] max-md:-mt-10"
            />
            <img
              src="/images/about/aboutIMG4.png"
              alt="aboutIMG"
              className="md:h-[192px] h-[140px] place-self-end"
            />
          </div>
        </div>

        <div className="w-full flex max-md:flex-col justify-end gap-9">
          <div className="md:w-[45%] flex justify-center gap-10">
            <img
              src="/images/about/aboutIMG1.png"
              alt="aboutIMG"
              className="md:h-[197px] h-[140px] max-md:-mt-10"
            />
            <img
              src="/images/about/aboutIMG2.png"
              alt="aboutIMG"
              className="md:h-[230px] h-[140px] place-self-end"
            />
          </div>
          <div className="text-lg md:w-[55%]">
            <p className="text-primary text-center font-bold mb-6">
              "Сайхан ирээдүйг сайн хүн биш сайн хүмүүс бүтээдэг"
            </p>
            <p className="font-medium">
              Одоогийн хувилбар дээр Дэмжих тал санд байршсан дурын хөтөлбөрийг
              дэмжсэнээр хүмүүнлэгийн модонд мөчир эзэмших ба тухайн модонд таны
              дэмжсэн хөтөлбөрийн тоогоор навч ургах байдлаар нийгмийн
              хариуцлагаа тодотгуулах түүхчилсэн самбар эзэмших болно. Хамтрагч
              байгууллагын тухайд өөрийн нэр, логогоор төсөл хөтөлбөрөө
              байршуулж, хандив босгох, өгөх, сургалт, арга хэмжээ зохион
              байгуулахаас гадна сайн дурын ажилтнуудад хамтарсан сертификат,
              дэмжигчдэдээ талархлын навч өгөх боломжтой. Харин сайн дурын
              ажилчдадаа бид үнэ цэнэтэй сайн дурын ажилд хувь нэмрээ оруулах,
              олон төрлийн сургалт, лекц, арга хэмжээнд үнэ төлбөргүй хамрагдах,
              бие даан хүмүүнлэгийн болон сургалтын арга хэмжээг санаачлан
              зохион байгуулах, XP волунтурын 4 эрэмбэ ахин, үнэ цэнэтэй
              хосолсон сертификаттай болох гэх мэт боломжуудыг олгохоор уг санг
              хөгжүүлж байна.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-primary text-center text-lg font-bold mb-16 md:mb-28">
            "Хамтдаа хайр дүүрэн ертөнцийг бүтээцгээе"
          </h2>
        </div>
      </section>

      {/* second section */}
      <section className="w-full bg-gradient-to-r from-[#F7F7F7] to-[#FFF8EE] py-16">
        <div className="container">
          <p className="text-center font-semibold text-3xl mb-5">
            Яагаад хураамж төлөх ёстой вэ?
          </p>
          <p className="font-medium text-center text-lg md:w-2/3 mx-auto">
            Эдгээр хураамжууд нь тус сангийн зар сурталчилгаа, маркетинг, үйл
            ажиллагааны зардал, цалин, татвар хураамж, сайн үйлсийн болон сайн
            дурын хөтөлбөр зэрэг зайлшгүй шаардлагатай зардлыг санхүүжүүлнэ.
          </p>
        </div>

        <div>
          <div className="mx-auto">
            <div className="my-9 flex justify-center">
              <button
                className={`px-3 py-1 rounded-t-[6px] ${tab == 'partner' && 'border-b-2 font-semibold'} border-primary hover:bg-white/70 text-xl`}
                onClick={() => setTab('partner')}
              >
                Хамтрагч
              </button>
              <button
                className={`px-3 py-1 rounded-t-[6px] ${tab == 'supporter' && 'border-b-2 font-semibold'} border-primary hover:bg-white/70 text-xl`}
                onClick={() => setTab('supporter')}
              >
                Дэмжигч
              </button>
            </div>
          </div>

          <div className={`${tab === 'partner' ? 'block' : 'hidden'}`}>
            <div className="md:container flex max-md:px-5 gap-5 md:gap-28 text-white overflow-x-auto no-scrollbar max-md:snap-x max-md:snap-mandatory">
              <div className="mx-auto max-md:snap-always max-md:snap-center flex max-md:min-w-[80vw] md:flex-1 flex-col h-[278px] rounded-xl bg-[url('/images/about/blueBG.png')] bg-cover px-5 py-6">
                <h2 className="flex text-3xl mb-1 font-black before:relative before:h-[28px] before:bg-white before:w-[4px] before:rounded-sm before:right-5">
                  ₮0
                  <p className="text-sm text-gray-200 my-auto ms-2">1 жил</p>
                </h2>
                <span className="text-white text-xl font-extrabold mb-2">
                  Basic Plan
                </span>
                <ul className="text-md min-h-[106px] text-gray-200 mb-2">
                  Та санд төсөл хөтөлбөр болон арга хэмжээ оруулах,сурталчилгаа
                  байршуулах болон өөрийн нэр дээрх хуудсыг хөгжүүлээрэй
                </ul>
                <Link href="#">
                  <button className="border-1.5 text-white px-7 py-3 rounded-2xl border-[#0356b2] bg-[#0356b2] text-lg font-bold hover:bg-transparent shadow-sm">
                    Гишүүн болох
                  </button>
                </Link>
              </div>
              {/* <div className="hidden max-md:snap-always max-md:snap-center w-[359px] flex-col justify-around rounded-xl bg-[url('/images/about/blueBG.png')] bg-cover pt-5  text-center before:relative before:h-[28px] before:bg-white before:w-[4px] before:rounded-sm">
                  {' '}
                  <section className="flex justify-around mx-auto">
                    <div className="flex pb-6 w-[329px] flex-col justify-around text-center">
                      <h2 className="relative bottom-7 left-3 flex text-3xl font-black">
                        ₮0
                        <p className="pl-2 pt-3 text-sm text-gray-200">1 жил</p>
                      </h2>
                      <span className="text-white relative bottom-5 left-3 text-start text-xl font-extrabold">
                        Basic Plan
                      </span>
                      <ul className="relative bottom-3 w-[254px] list-disc pl-16 text-start">
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
                        <button className="relative px-3 py-2 rounded-xl bg-primary text-lg">
                          Гишүүн болох
                        </button>
                      </Link>
                    </div>
                  </section>
                </div> */}

              <div className="mx-auto max-md:snap-always max-md:snap-center flex max-md:min-w-[80vw] md:flex-1 flex-col h-[278px] rounded-xl bg-[url('/images/about/primaryBG.png')] bg-cover px-5 py-6">
                <h2 className="flex text-3xl mb-1 font-black before:relative before:h-[28px] before:bg-white before:w-[4px] before:rounded-sm before:right-5">
                  ₮3'000'000
                  <p className="text-sm text-gray-200 my-auto ms-2">1 жил</p>
                </h2>
                <span className="text-white text-xl font-extrabold mb-2">
                  Standart Plan
                </span>
                <ul className="text-md min-h-[106px] text-gray-200 mb-2">
                  Та санд төсөл хөтөлбөр болон арга хэмжээ оруулах,сурталчилгаа
                  байршуулах болон өөрийн нэр дээрх хуудсыг хөгжүүлээрэй
                </ul>
                <Link href="#">
                  <button className="border-1.5 text-white px-7 py-3 rounded-2xl border-primary bg-primary text-lg font-bold hover:bg-transparent shadow-sm">
                    Гишүүн болох
                  </button>
                </Link>
              </div>
              <div className="mx-auto max-md:snap-always max-md:snap-center flex max-md:min-w-[80vw] md:flex-1 flex-col h-[278px] rounded-xl bg-gradient-to-br from-white via-cyan-500 via-70% to-primary-700 bg-cover px-5 py-6">
                <h2 className="flex text-3xl mb-1 font-black before:relative before:h-[28px] before:bg-white before:w-[4px] before:rounded-sm before:right-5">
                  Premium Plan
                </h2>
                <span className="text-white text-xl font-extrabold mb-2">
                  Coming soon...
                </span>
                <ul className="text-md h-[106px] text-gray-200 mb-2 flex justify-center">
                  <img
                    src="/images/about/woman.png"
                    alt="woman"
                    className="h-[100px] my-auto self-center"
                  />
                </ul>
              </div>
            </div>
          </div>

          <div className={`${tab === 'supporter' ? 'block' : 'hidden'}`}>
            <div className="md:container flex max-md:px-5 gap-5 md:gap-28 text-white overflow-x-auto no-scrollbar max-md:snap-x max-md:snap-mandatory">
              <div className="mx-auto max-md:snap-always max-md:snap-center flex max-md:min-w-[80vw] md:flex-1 flex-col h-[278px] rounded-xl bg-gradient-to-br from-white via-cyan-500 via-70% to-primary-700 bg-cover px-5 py-6">
                <h2 className="flex text-3xl mb-1 font-black before:relative before:h-[28px] before:bg-white before:w-[4px] before:rounded-sm before:right-5">
                  Premium Plan
                </h2>
                <span className="text-white text-xl font-extrabold mb-2">
                  Coming soon...
                </span>
                <ul className="text-md h-[106px] text-gray-200 mb-2 flex justify-center">
                  <img
                    src="/images/about/woman.png"
                    alt="woman"
                    className="h-[100px] my-auto self-center"
                  />
                </ul>
              </div>
              <div className="mx-auto max-md:snap-always max-md:snap-center flex max-md:min-w-[80vw] md:flex-1 flex-col h-[278px] rounded-xl bg-gradient-to-br from-white via-cyan-500 via-70% to-primary-700 bg-cover px-5 py-6">
                <h2 className="flex text-3xl mb-1 font-black before:relative before:h-[28px] before:bg-white before:w-[4px] before:rounded-sm before:right-5">
                  Premium Plan
                </h2>
                <span className="text-white text-xl font-extrabold mb-2">
                  Coming soon...
                </span>
                <ul className="text-md h-[106px] text-gray-200 mb-2 flex justify-center">
                  <img
                    src="/images/about/woman.png"
                    alt="woman"
                    className="h-[100px] my-auto self-center"
                  />
                </ul>
              </div>
              <div className="mx-auto max-md:snap-always max-md:snap-center flex max-md:min-w-[80vw] md:flex-1 flex-col h-[278px] rounded-xl bg-gradient-to-br from-white via-cyan-500 via-70% to-primary-700 bg-cover px-5 py-6">
                <h2 className="flex text-3xl mb-1 font-black before:relative before:h-[28px] before:bg-white before:w-[4px] before:rounded-sm before:right-5">
                  Premium Plan
                </h2>
                <span className="text-white text-xl font-extrabold mb-2">
                  Coming soon...
                </span>
                <ul className="text-md h-[106px] text-gray-200 mb-2 flex justify-center">
                  <img
                    src="/images/about/woman.png"
                    alt="woman"
                    className="h-[100px] my-auto self-center"
                  />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex container w-full flex-col py-10 md:py-32 gap-16">
        <div className="flex justify-start gap-8 md:gap-16">
          <div className="max-md:w-1/3">
            <img src="/images/about/AboutFam1.png" alt="all in one" />
          </div>
          <div className="flex md:flex-1 w-2/3 flex-col my-auto">
            <h1 className="text-2xl font-bold">Бүгдийг нэг дороос</h1>
            <p className="text-md pt-3 font-semibold">
              is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since
              the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book
            </p>
          </div>
          <div className="md:flex-1 max-md:hidden"></div>
        </div>
        <div className="flex justify-end gap-8 md:gap-16">
          <div className="md:flex-1 max-md:hidden"></div>
          <div className="flex md:flex-1 w-2/3 flex-col my-auto">
            <h1 className="text-2xl font-bold">Таны дэмжлэгийг бид үнэлнэ</h1>
            <p className="text-md pt-3 font-semibold">
              is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since
              the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book
            </p>
          </div>
          <div className="max-md:w-1/3">
            <img
              src="/images/about/AboutFam2.png"
              alt="all in one"
              className=""
            />
          </div>
        </div>
        <div className="flex justify-start gap-8 md:gap-16">
          <div className="max-md:w-1/3">
            <img
              src="/images/about/AboutFam3.png"
              alt="all in one"
              className=""
            />
          </div>
          <div className="flex md:flex-1 w-2/3 flex-col my-auto">
            <h1 className="text-2xl font-bold">Эерэг бүхнийг түгээе</h1>
            <p className="text-md pt-3 font-semibold">
              is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since
              the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book
            </p>
          </div>
          <div className="md:flex-1 max-md:hidden"></div>
        </div>
        <div className="flex justify-end gap-8 md:gap-16">
          <div className="md:flex-1 max-md:hidden"></div>
          <div className="flex md:flex-1 w-2/3 flex-col my-auto">
            <h1 className="text-2xl font-bold">
              Илүү ихийг хамтдаа бүтээцгээе
            </h1>
            <p className="text-md pt-3 font-semibold">
              is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since
              the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book
            </p>
          </div>
          <div className="max-md:w-1/3">
            <img
              src="/images/about/AboutFam4.png"
              alt="all in one"
              className=""
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#C6EFF1] from-10% via-[#F4F1FF] to-[#F9E0BA] py-16 md:py-28">
        <div className="container grid sm:grid-cols-2 lg:grid-cols-4 justify-center gap-10">
          <div className="rounded-md">
            <div className="rounded-[8px] mx-auto bg-white p-4 md:flex-1 h-[358px]">
              <Image
                src="/images/about/goodHuman.png"
                className="h-[230px] w-[271px] mb-4"
                alt="good human"
              />
              <p className="font-semibold text-lg mb-2">Be a good human</p>
              <p className="text-md font-medium text-black/60">
                Сайн дурынхныг хөгжүүлэх хөтөлбөр
              </p>
            </div>
          </div>
          <div className="rounded-md">
            <div className="rounded-[8px] mx-auto bg-white p-4 md:flex-1 h-[358px]">
              <Image
                className="mb-4 h-[230px] w-[271px]"
                src="/images/about/wizard.png"
                alt="wizard"
              />
              <p className="font-semibold text-lg mb-2">12 сарын шидтэн</p>

              <p className="text-md font-medium text-black/60">
                Хорт хавдартай хүүхдүүдэд шинэ жилийн баяр зохион байгуулдаг аян
              </p>
            </div>
          </div>
          <div className="rounded-md">
            <div className="rounded-[8px] mx-auto bg-white p-4 md:flex-1 h-[358px]">
              <Image
                className="mb-4 h-[230px] w-[271px]"
                src="/images/about/warm.png"
                alt="warm"
              />
              <p className="font-semibold text-lg mb-2">Дулаан өвөлжөөрэй</p>

              <p className="text-md font-medium text-black/60">
                Амжиргааны түвшин доогуур хүүхдүүдэд туслах сайн үйлсийн аян
              </p>
            </div>
          </div>
          <div className="rounded-md">
            <div className="rounded-[8px] mx-auto bg-white p-4 md:flex-1 h-[358px]">
              <Image
                className="mb-4 h-[230px] w-[271px]"
                src="/images/about/dream.png"
                alt="dream"
              />
              <p className="font-semibold text-lg mb-2">Надад мөрөөдөл бий</p>

              <p className="text-md font-medium text-black/60">
                Сайн дурынхны чөлөөт өдөрлөг
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
