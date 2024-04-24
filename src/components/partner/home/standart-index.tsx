import { priceFormat } from '@/lib/utils/price';
import {
  BackgroundImage,
  Box,
  Flex,
  Grid,
  Paper,
  RingProgress,
  SimpleGrid,
  Space,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconCalendar,
  IconHeartFilled,
  IconUsersGroup,
} from '@tabler/icons-react';
import { BannerPermits } from './banner-permits';
import { StandartShop } from './standart-shop';

export const StandartHome = () => {
  return (
    <Box>
      <SimpleGrid cols={{ base: 1, lg: 3 }} w={'100%'}>
        <Paper shadow="md" p={'sm'} bg={'white'} w={'100%'}>
          <Flex justify={'space-between'} align={'center'} h={'100%'}>
            <Stack gap={2}>
              <Text>Төсөл хөтөлбөр, Арга хэмжээ</Text>
              <Text fw={600} size="lg">
                4
              </Text>
            </Stack>
            <ThemeIcon size={'xl'} radius={'md'} color="primary.8">
              <IconCalendar />
            </ThemeIcon>
          </Flex>
        </Paper>
        <Paper shadow="md" p={'sm'} bg={'white'} w={'100%'}>
          <Flex justify={'space-between'} align={'center'} h={'100%'}>
            <Stack gap={2}>
              <Text>Нийт хандив</Text>
              <Text fw={600} size="lg">
                {priceFormat(10000, 'MNT')}
              </Text>
            </Stack>
            <ThemeIcon size={'xl'} radius={'md'} color="primary.8">
              <IconHeartFilled />
            </ThemeIcon>
          </Flex>
        </Paper>
        <Paper shadow="md" p={'sm'} bg={'white'} w={'100%'}>
          <Flex justify={'space-between'} align={'center'} h={'100%'}>
            <Stack gap={2}>
              <Text>Нийт сайн дурын ажилчид</Text>
              <Text fw={600} size="lg">
                4
              </Text>
            </Stack>
            <ThemeIcon size={'xl'} radius={'md'} color="primary.8">
              <IconUsersGroup />
            </ThemeIcon>
          </Flex>
        </Paper>
      </SimpleGrid>
      <Space h={'lg'} />
      <Grid columns={12}>
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <Stack w={'100%'} h={'100%'} gap={'lg'}>
            <Paper
              shadow="md"
              bg={'yellow.5'}
              w={'100%'}
              h={'100%'}
              radius={'md'}
              style={{ overflow: 'hidden' }}
            >
              <BackgroundImage p={'md'} src={'icons/wave/yellow-wave.svg'}>
                <Title mb={'md'} order={3} c={'white'}>
                  Арга хэмжээ
                </Title>
                <Flex justify={'space-between'} align={'end'}>
                  <RingProgress
                    roundCaps
                    thickness={5}
                    sections={[
                      { value: 70, color: 'yellow.6' },
                      { value: 30, color: 'white' },
                    ]}
                    label={
                      <Flex justify={'center'}>
                        <Text lts={3} c={'white'} fw={600} fz={'lg'}>
                          40%
                        </Text>
                      </Flex>
                    }
                  />
                  <Stack align="end" gap={0}>
                    <Text c={'white'} fw={600} fz={48}>
                      3
                    </Text>
                    <Text c={'yellow.1'}>Арга хэмжээ үүсгэх дээд хязгаар</Text>
                  </Stack>
                </Flex>
              </BackgroundImage>
            </Paper>
            <Paper
              shadow="md"
              bg={'green.4'}
              w={'100%'}
              h={'100%'}
              radius={'md'}
              style={{ overflow: 'hidden' }}
            >
              <BackgroundImage p={'md'} src={'icons/wave/green-wave.svg'}>
                <Title mb={'md'} order={3} c={'white'}>
                  Төсөл хөтөлбөр
                </Title>
                <Flex justify={'space-between'} align={'end'}>
                  <RingProgress
                    roundCaps
                    thickness={5}
                    sections={[
                      { value: 70, color: 'green.5' },
                      { value: 30, color: 'white' },
                    ]}
                    label={
                      <Flex justify={'center'}>
                        <Text c={'white'} lts={3} fw={600} fz={'lg'}>
                          40%
                        </Text>
                      </Flex>
                    }
                  />
                  <Stack align="end" gap={0}>
                    <Text c={'white'} fw={600} fz={48}>
                      3
                    </Text>
                    <Text c={'green.1'}>
                      Төсөл хөтөлбөр үүсгэх дээд хязгаар
                    </Text>
                  </Stack>
                </Flex>
              </BackgroundImage>
            </Paper>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 5 }}>
          <StandartShop />
        </Grid.Col>
      </Grid>
      <Space h="lg" />
      <BannerPermits />
    </Box>
  );
};
