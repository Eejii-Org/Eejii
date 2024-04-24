import { FallbackImage } from '@/components/common/fallback-image';
import { api } from '@/utils/api';
import { Carousel, CarouselSlide } from '@mantine/carousel';
import {
  Box,
  Paper,
  Text,
  Button,
  Flex,
  Center,
  BackgroundImage,
  Avatar,
  Transition,
} from '@mantine/core';
import format from 'date-fns/format';
import NextImage from 'next/image';
import { useHover } from '@mantine/hooks';
// import { PDFDownloadLink } from '@react-pdf/renderer';
import { EventCertificate } from '@/components/pdf/certificate';
import dynamic from 'next/dynamic';
import type { Certificate } from '@/lib/types';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(el => el.PDFDownloadLink),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);
const CertificateSlide = ({
  qrCode,
  cert,
}: {
  qrCode: string;
  cert: Certificate;
}) => {
  const { hovered, ref } = useHover();
  let levelImg = '';
  if (cert.grade === 1) {
    levelImg = '/images/volunteer_level/level_1.png';
  } else if (cert.grade === 2) {
    levelImg = '/images/volunteer_level/level_2.png';
  } else if (cert.grade === 3) {
    levelImg = '/images/volunteer_level/level_3.png';
  } else if (cert.grade === 4) {
    levelImg = '/images/volunteer_level/level_4.png';
  }
  return (
    <CarouselSlide p="md" my={'auto'}>
      <Paper
        ref={ref}
        pos={'relative'}
        withBorder
        style={{
          aspectRatio: '21 / 29.7',
        }}
      >
        <BackgroundImage h={'100%'} src={'/pdf/background.png'}>
          <Box h={'100%'} w={'100%'} ta={'center'} p={'lg'} px={25}>
            <Text mb={3}>Certificate</Text>
            <Text fz={8} lh={1}>
              For volunteering
            </Text>
            <Text fz={8} lh={1}>
              participation
            </Text>
            <Flex justify={'center'} pos={'relative'} my={6}>
              <Avatar
                src={levelImg}
                alt="logo"
                size={'sm'}
                style={{
                  alignSelf: 'center',
                  position: 'absolute',
                }}
              />
              <NextImage
                alt=""
                height={45}
                width={45}
                src={'/images/logo/wreath_icon.png'}
              />
            </Flex>
            <Text size="sm" mb={2}>
              {cert.volunteerName}
            </Text>
            <Text fz={8}>{cert.Template?.description}</Text>
            <Text fz={8} mt={1}>
              {cert.Template?.shortDescription}
            </Text>
            <Flex justify={'space-between'} h={40} align={'center'} my={'xs'}>
              <Box
                w={60}
                h={30}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <NextImage
                  src={qrCode}
                  alt="logo"
                  width={30}
                  height={20}
                  objectFit="contain"
                  objectPosition="center"
                />
                <Text fz={6}>Scan the qr</Text>
              </Box>
              <Box w={60} h={30}>
                <NextImage
                  src={'/images/logo/EEJII_Logo_Colored.png'}
                  alt="logo"
                  width={60}
                  height={40}
                  objectFit="contain"
                  objectPosition="center"
                />
                <Text fz={6}>Eejii</Text>
              </Box>
              <Box w={60} h={30}>
                <NextImage
                  src={
                    process.env.NEXT_PUBLIC_AWS_PATH +
                    '/' +
                    cert.Template?.logoPath
                  }
                  alt="logo"
                  width={60}
                  height={40}
                  objectFit="contain"
                  objectPosition="center"
                />
                <Text fz={6}>{cert.organizationName}</Text>
              </Box>
            </Flex>
            <Text fz={8}>
              {format(cert.createdAt as unknown as number, 'yyyy MMM dd')}
            </Text>
          </Box>
        </BackgroundImage>
        <Transition
          mounted={hovered}
          transition={'fade'}
          duration={300}
          timingFunction="ease"
        >
          {transitionStyle => (
            <Box
              pos="absolute"
              top={0}
              left={0}
              w="100%"
              h="100%"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.7)',
                ...transitionStyle,
                zIndex: 1,
              }}
            >
              <Button>
                <PDFDownloadLink
                  document={
                    <EventCertificate
                      description={cert?.Template?.description ?? ''}
                      shortDescription={cert?.Template?.shortDescription ?? ''}
                      organizationName={cert?.organizationName}
                      volunteerName={cert?.volunteerName}
                      certificateNumber={cert?.number}
                      level={cert?.grade}
                      logoUrl={
                        process.env.NEXT_PUBLIC_AWS_PATH +
                        '/' +
                        cert?.Template?.logoPath
                      }
                      qrCode={qrCode}
                    />
                  }
                  fileName="certificate.pdf"
                >
                  {({ loading }) =>
                    loading ? 'Loading document...' : 'Download now!'
                  }
                </PDFDownloadLink>
              </Button>
            </Box>
          )}
        </Transition>
      </Paper>
    </CarouselSlide>
  );
};

export const CertificatesSlider = ({ qrCode }: { qrCode: string }) => {
  const { data, isLoading } = api.volunteer.getMyCertificates.useQuery();

  return (
    <Box>
      {!isLoading && data ? (
        <Carousel
          withIndicators
          height={400}
          slideSize="33.333333%"
          slideGap="md"
          loop
          align="start"
          slidesToScroll={3}
        >
          {data.map((cert, i) => (
            <CertificateSlide
              qrCode={qrCode}
              cert={cert as unknown as Certificate}
              key={i}
            />
          ))}
        </Carousel>
      ) : (
        <div>
          <Text ta="center" maw="500" m="auto">
            Одоогоор сертификат аваагүй байна. Арга хэмжээнд оролцсоныхоо дараа
            энэ хэсгээс сертификат болон тодорхойлолтоо аваарай{' '}
          </Text>
          <Center mt="20">
            <FallbackImage
              src={'/icons/volunteer.svg'}
              width={100}
              height={100}
              alt="img"
            />
          </Center>
        </div>
      )}
    </Box>
  );
};
