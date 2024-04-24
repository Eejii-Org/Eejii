import { FallbackImage } from '@/components/common/fallback-image';
import { priceFormat } from '@/lib/utils/price';
import {
  Image,
  Button,
  Text,
  Grid,
  Modal,
  Paper,
  Title,
  Stack,
  SimpleGrid,
  NumberInput,
  UnstyledButton,
  TextInput,
  Flex,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';

export const DonateModal = ({ label }: { label: string }) => {
  const [donateAmount, setDonateAmount] = useState(0);
  const [opened, { close, open }] = useDisclosure();
  const isMobile = useMediaQuery('(max-width: 50em)');

  const amounts = [10000, 20000, 40000, 50000, 80000, 100000];
  return (
    <>
      <Button onClick={open}>{label}</Button>
      <Modal
        opened={opened}
        bg={'none'}
        fullScreen={isMobile}
        onClose={close}
        size={'80%'}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        withCloseButton={false}
        shadow="0"
        styles={{
          header: {
            backgroundColor: 'transparent',
          },
          content: {
            backgroundColor: 'transparent',
          },
        }}
      >
        <Grid columns={13}>
          <Grid.Col span={{ base: 13, lg: 7 }} hidden={isMobile}>
            <Paper bg={'white'} radius={'lg'} className="overflow-hidden">
              <FallbackImage
                src={''}
                alt="img"
                width={600}
                fullWidth
                height={300}
              />
              <Stack px={'lg'} py={'md'}>
                <Image
                  src="/images/home/foundation_logo.jpg"
                  alt="foundation Logo"
                  h={70}
                  w={200}
                  fit="contain"
                />
                <Title order={5}>Бидний үйл ажиллагаанд хандив өргөснөөр</Title>
                <Text>
                  Cүүлийн жилүүдэд сайн дурын ажил хийх хүсэл сонирхолтой
                  хүмүүсийн тоо эрчимтэй өсөж байгаа нь гайхалтай билээ. Энэ нь
                  бид бусдын төлөө сэтгэлтэй болж өсөж, хүмүүжиж байгаагийн
                  илэрхийлэл юм. Бидэнд хандив өргөсөнд баярлалаа! дэлгэрэнгүй
                  мэдээлэлтэй танилцах бол энд дарна уу Бидэнтэй холбогдох
                </Text>
                <Title order={5}>Бидэнд хандив өргөсөнд баярлалаа!</Title>
              </Stack>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 13, lg: 6 }}>
            <Paper bg={'white'} p={20} radius={'lg'} h={'100%'}>
              <Stack gap={'xl'} justify="space-between" h={'100%'}>
                <Stack gap={'xl'} justify="space-between">
                  <Flex justify={{ base: 'space-between', lg: 'center' }}>
                    <Image
                      src="/images/home/foundation_logo.jpg"
                      alt="foundation Logo"
                      h={70}
                      w={200}
                      fit="contain"
                    />
                    <Button onClick={close} variant="subtle" hiddenFrom="sm">
                      Хаах
                    </Button>
                  </Flex>
                  <SimpleGrid cols={2} spacing={'xs'} w={'100%'}>
                    {amounts.map(amount => (
                      <UnstyledButton
                        onClick={() => setDonateAmount(amount)}
                        key={amount}
                      >
                        <Paper withBorder p={20} radius={'md'}>
                          <Text size="sm">{priceFormat(amount, 'MNT')}</Text>
                        </Paper>
                      </UnstyledButton>
                    ))}
                  </SimpleGrid>
                  <NumberInput
                    radius={'md'}
                    w="100%"
                    styles={{
                      input: {
                        color: 'var(--mantine-color-primary-9)',
                        fontWeight: 700,
                        fontSize: 24,
                      },
                    }}
                    leftSection="₮"
                    decimalScale={2}
                    thousandSeparator=","
                    fixedDecimalScale
                    hideControls
                    value={donateAmount / 100}
                    size="xl"
                  />
                  <TextInput placeholder="Email" size="lg" label="Имэйл" />
                </Stack>
                <Button fullWidth color="primary" size="lg" radius={'md'}>
                  Хандивлах
                </Button>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Modal>
    </>
  );
};
