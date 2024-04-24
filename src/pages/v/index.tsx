import { FallbackImage } from '@/components/common/fallback-image';
import PublicLayout from '@/components/layout/public-layout';
import QRCode from 'qrcode';
import { api } from '@/utils/api';
import {
  Space,
  Text,
  Avatar,
  Box,
  Container,
  Flex,
  Grid,
  Paper,
  Stack,
  Title,
  ActionIcon,
  Badge,
  Progress,
  Divider,
  Button,
  Anchor,
  LoadingOverlay,
} from '@mantine/core';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { UserType } from '@/lib/db/enums';
import { useEffect, useState } from 'react';
import { IconCamera, IconEdit } from '@tabler/icons-react';
import { MyEvents } from '@/components/volunteer/home/my-events';
import { CertificateSection } from '@/components/volunteer/home/certificate-section';
import { Explore } from '@/components/volunteer/home/explore';
import Link from 'next/link';

export default function Index() {
  const session = useSession();
  const [qr, setQr] = useState<string>();
  const { data: volunteer, isLoading } = api.volunteer.findById.useQuery({
    id: session.data?.user.id as string,
  });

  useEffect(() => {
    if (volunteer) {
      QRCode.toDataURL(
        volunteer?.id,
        {
          width: 400,
          margin: 0,
          color: {
            dark: '#000000',
          },
        },
        (err, url) => {
          if (err) return console.error(err);
          setQr(url);
        }
      );
    }
  }, [volunteer]);

  if (isLoading) return <LoadingOverlay />;

  const avatar =
    volunteer && volunteer?.Images?.length > 0
      ? process.env.NEXT_PUBLIC_AWS_PATH +
        '/' +
        volunteer?.Images.find(i => i.type === 'avatar')?.path
      : null;
  return (
    <PublicLayout>
      <FallbackImage width={1500} height={300} fullWidth alt="bg" src={''} />
      <Box bg={'white'} mah={{ base: 280, lg: 230 }}>
        <Container size={'xl'}>
          <Flex p="sm" gap={20}>
            <Paper
              bg={'white'}
              pos={'relative'}
              radius={'200'}
              className="outline-6 overflow-hiden -translate-y-12 p-1 outline-white"
            >
              <Avatar size={250} src={avatar} />
              <ActionIcon
                radius={'xl'}
                size={'xl'}
                pos={'absolute'}
                variant={'white'}
                bottom={30}
                right={10}
              >
                <IconCamera size={35} />
              </ActionIcon>
            </Paper>
            <Stack gap={'sm'}>
              <Title>
                {volunteer?.firstName} {volunteer?.lastName}
              </Title>
              <Text>
                {volunteer?.type === UserType.USER_VOLUNTEER ? 'Volunteer' : ''}
              </Text>
              <FallbackImage
                src={qr as string}
                alt="qr"
                width={100}
                height={100}
              />
            </Stack>
          </Flex>
        </Container>
      </Box>
      <Space h="xl" />
      <Container size={'xl'}>
        <Grid columns={12} gutter={'xl'}>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Paper bg={'white'} p={20} shadow="xs">
              <Flex
                direction={'column'}
                align={'center'}
                justify={'center'}
                gap={10}
              >
                <Image
                  src={`/images/volunteer_level/level_${volunteer?.level ?? 1}.png`}
                  alt="level"
                  width={100}
                  height={100}
                />
                <Badge bg="indigo.8" size="lg" px={20}>
                  Level {volunteer?.level ?? 1}
                </Badge>
                <Flex>
                  <Text c={'primary'} fw={'500'}>
                    {volunteer?.xp}
                  </Text>

                  <Text c={'dimmed'} fw={'500'}>
                    /20xp
                  </Text>
                </Flex>
                <Box w="100%">
                  <Progress color="secondary.3" size="lg" value={50} />
                </Box>
              </Flex>
              <Space h={'lg'} />
              <Flex align={'center'} justify={'space-between'}>
                {' '}
                <Text fw={500}>Био</Text>{' '}
                <Button
                  leftSection={<IconEdit />}
                  component={Link}
                  href={'/v/profile'}
                  variant={'transparent'}
                >
                  {' '}
                  Edit
                </Button>
              </Flex>
              <Divider />
              <Flex
                justify={'center'}
                align={'center'}
                direction="column"
                mih={165}
                mt="10"
              >
                {volunteer?.bio ? (
                  <Text>{volunteer.bio}</Text>
                ) : (
                  <Text ta="center">
                    Өөрийнхөө тухай мэдээллийг{' '}
                    <Anchor fw={600} fz="18" href={'/v/profile'}>
                      энд
                    </Anchor>{' '}
                    дарж оруулаарай
                  </Text>
                )}
              </Flex>
              <Space h={'lg'} />
              <Flex align={'center'} justify={'space-between'}>
                {' '}
                <Text fw={500}>Ур чадварууд</Text>{' '}
                <Button
                  leftSection={<IconEdit />}
                  component={Link}
                  href={'/v/profile'}
                  variant={'transparent'}
                >
                  {' '}
                  Edit
                </Button>
              </Flex>
              <Divider />
              <Flex
                justify={'center'}
                align={'center'}
                direction="column"
                mih={164}
                mt="10"
              >
                {volunteer?.UserSkills && volunteer?.UserSkills?.length > 0 ? (
                  volunteer?.UserSkills?.map(skill => (
                    <Text key={skill.id}>{skill.Skill?.name}</Text>
                  ))
                ) : (
                  <Text ta="center">
                    Өөрийнхөө ур чадваруудыг{' '}
                    <Anchor fw={600} fz="18" href="/v/profile">
                      энд
                    </Anchor>{' '}
                    дарж оруулаарай
                  </Text>
                )}
              </Flex>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
            <CertificateSection
              qrCode={qr as string}
              userId={session.data?.user?.id}
            />
            <Space h="lg" />
            <MyEvents volunteerId={volunteer?.id as string} />
          </Grid.Col>
        </Grid>
        <Space h="80" />
        <Explore />
      </Container>
    </PublicLayout>
  );
}
