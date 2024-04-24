// import {
//   BackgroundImage,
//   Button,
//   Container,
//   Flex,
//   Image,
//   Paper,
//   SimpleGrid,
//   Text,
//   Title,
// } from '@mantine/core';
// import { IconArrowRight } from '@tabler/icons-react';
// import Link from 'next/link';
import { Card } from '@/components/card/card';
import { EventType } from '@/lib/db/enums';
import { api } from '@/utils/api';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import { useMemo } from 'react';
export default function Features() {
  const {
    data: lastVolunteeringEventData,
    isLoading: isVolunteeringEventLoading,
  } = api.event.findAll.useQuery({
    page: 1,
    limit: 1,
    type: EventType.VOLUNTEERING,
  });
  const { data: lastEventData, isLoading: isEventLoading } =
    api.event.findAll.useQuery({
      page: 1,
      limit: 1,
      type: EventType.EVENT,
    });
  const { data: lastProjectData, isLoading: isProjectLoading } =
    api.project.findAll.useQuery({
      page: 1,
      limit: 1,
    });
  const featuresData = useMemo(() => {
    return {
      event: lastEventData?.items[0],
      volunteeringEvent: lastVolunteeringEventData?.items[0],
      project: lastProjectData?.items[0],
    };
  }, [lastEventData, lastVolunteeringEventData, lastProjectData]);
  console.log(featuresData);
  return (
    <div className="container py-16 items-center">
      <h1 className="text-5xl font-semibold pb-16">
        <span className="text-primary">Eejii.org</span>-ийн онцлог
      </h1>
      <div className="flex flex-row gap-16 items-start">
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="font-semibold text-2xl pl-[28px]">
            Төсөл хөтөлбөрүүд
          </h2>
          <Card
            showHighlight
            cardType="project"
            cardData={featuresData.project}
            loading={isProjectLoading}
            cardSize="small"
          />
          <Link
            href="/projects"
            className="flex items-end justify-end text-primary font-bold"
          >
            Бүгд
            <IconArrowRight />
          </Link>
        </div>
        <div className="flex-1 flex flex-col gap-6 pt-16">
          <h2 className="font-semibold text-2xl pl-[28px]">Арга хэмжээ</h2>
          <Card
            showHighlight
            cardType="event"
            cardData={featuresData.event}
            loading={isEventLoading}
            highlightColor="#C99FFF"
            cardSize="small"
          />
          <Link
            href="/events"
            className="flex items-end justify-end text-primary font-bold"
          >
            Бүгд <IconArrowRight />
          </Link>
        </div>
        <div className="flex-1 flex flex-col gap-6 pt-32">
          <h2 className="font-semibold text-2xl pl-[28px]">Сайн дурын ажил</h2>
          <Card
            showHighlight
            cardType="event"
            cardData={featuresData.volunteeringEvent}
            loading={isVolunteeringEventLoading}
            highlightColor="#BFE88C"
            cardSize="small"
          />
          <Link
            href="/events"
            className="flex items-end justify-end text-primary font-bold"
          >
            Бүгд
            <IconArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div>
  //     <Container ta={'start'} size={'xl'}>
  //       <Title ml={20} order={1}>
  //         <span className="text-primary">Eejii.org</span>-ийн онцлог
  //       </Title>
  //       <SimpleGrid cols={{ base: 1, lg: 3 }}>
  //         {/* event1 */}
  //         <Paper
  //           p={20}
  //           bg="none"
  //           className="relative before:absolute before:bottom-12  before:left-2 before:h-[290px] before:w-[4px] before:bg-[#FBC26E]"
  //         >
  //           <Title order={5} p={10}>
  //             Төсөл хөтөлбөрүүд
  //           </Title>
  //           <Flex direction={{ base: 'row', lg: 'column' }}>
  //             <Image
  //               height={'180'}
  //               w={{ base: '200', md: '500', lg: '100%' }}
  //               src="/images/eventss/event_img1.png"
  //               alt="projectIMG"
  //             />
  //             <Text p={10}>
  //               “Ээжий Ертөнц” НҮТББ-ын хөнгөвчлөх тусламж үйлчилгээг сайжруулах
  //               зорилгын дор нийт 300 ширхэг дотроо 30 төрлийн хэрэглээний
  //               бүтээгдэхүүнийг багц болгон ХАЙР ДҮҮРЭН ЦҮНХ болгоод 120 өвчтөнд
  //               эмнэлгийн тодорхойлолтын дагуу “Ээжий” <br /> төслөөс хандивлах
  //               юм.
  //             </Text>
  //           </Flex>
  //           <Flex justify={'end'}>
  //             <Button
  //               variant="subtle"
  //               color="var(--mantine-color-primary-8)"
  //               component={Link}
  //               href={'/projects'}
  //               rightSection={<IconArrowRight />}
  //             >
  //               Бүгд
  //             </Button>
  //           </Flex>
  //         </Paper>
  //         {/* event2 */}
  //         <Paper
  //           p={20}
  //           bg="none"
  //           // display={'flex'}
  //           className="relative before:absolute before:bottom-12  before:left-2 before:h-[290px] before:w-[4px] before:bg-[#FBC26E]"
  //         >
  //           <Title order={5} p={10}>
  //             Төсөл хөтөлбөрүүд
  //           </Title>
  //           <Flex direction={{ base: 'row', lg: 'column' }}>
  //             <Image
  //               height={'180'}
  //               w={{ base: '200', md: '500', lg: '100%' }}
  //               src="/images/eventss/event_img2.png"
  //               alt="projectIMG"
  //             />
  //             <Text p={10}>
  //               “Ээжий Ертөнц” НҮТББ-ын хөнгөвчлөх тусламж үйлчилгээг сайжруулах
  //               зорилгын дор нийт 300 ширхэг дотроо 30 төрлийн хэрэглээний
  //               бүтээгдэхүүнийг багц болгон ХАЙР ДҮҮРЭН ЦҮНХ болгоод 120 өвчтөнд
  //               эмнэлгийн тодорхойлолтын дагуу “Ээжий” <br /> төслөөс хандивлах
  //               юм.
  //             </Text>
  //           </Flex>
  //           <Flex justify={'end'}>
  //             <Button
  //               variant="subtle"
  //               color="var(--mantine-color-primary-8)"
  //               component={Link}
  //               href={'/projects'}
  //               rightSection={<IconArrowRight />}
  //             >
  //               Бүгд
  //             </Button>
  //           </Flex>
  //         </Paper>
  //         <Paper
  //           p={20}
  //           bg="none"
  //           // display={'flex'}
  //           className="relative before:absolute before:bottom-12  before:left-2 before:h-[290px] before:w-[4px] before:bg-[#FBC26E]"
  //         >
  //           <Title order={5} p={10}>
  //             Төсөл хөтөлбөрүүд
  //           </Title>
  //           <Flex direction={{ base: 'row', lg: 'column' }}>
  //             <Image
  //               height={'180'}
  //               w={{ base: '200', md: '500', lg: '100%' }}
  //               src="/images/eventss/event_img3.png"
  //               alt="projectIMG"
  //             />
  //             <Text p={10}>
  //               “Ээжий Ертөнц” НҮТББ-ын хөнгөвчлөх тусламж үйлчилгээг сайжруулах
  //               зорилгын дор нийт 300 ширхэг дотроо 30 төрлийн хэрэглээний
  //               бүтээгдэхүүнийг багц болгон ХАЙР ДҮҮРЭН ЦҮНХ болгоод 120 өвчтөнд
  //               эмнэлгийн тодорхойлолтын дагуу “Ээжий” <br /> төслөөс хандивлах
  //               юм.
  //             </Text>
  //           </Flex>
  //           <Flex justify={'end'}>
  //             <Button
  //               variant="subtle"
  //               color="var(--mantine-color-primary-8)"
  //               component={Link}
  //               href={'/projects'}
  //               rightSection={<IconArrowRight />}
  //             >
  //               Бүгд
  //             </Button>
  //           </Flex>
  //         </Paper>
  //       </SimpleGrid>
  //     </Container>
  //   </div>
  // );
}
