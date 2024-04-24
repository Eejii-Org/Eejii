import { priceFormat } from '@/lib/utils/price';
import {
  Group,
  BackgroundImage,
  Box,
  Button,
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
  IconCrown,
  IconHeartFilled,
  IconUsersGroup,
} from '@tabler/icons-react';
import { BasicShop } from './basic-shop';

export const BasicHome = () => {
  return (
    <Box w={'100%'}>
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
      <Paper p={'md'} shadow="md">
        <Flex justify={'space-between'}>
          <Title c="primary.9">Your current plan: Basic Plan </Title>
          <Button
            size="lg"
            leftSection={<IconCrown />}
            radius={'xl'}
            variant="gradient"
            gradient={{ from: 'yellow.5', to: 'orange.6', deg: 90 }}
          >
            Upgrade to Standart Plan
          </Button>
        </Flex>
      </Paper>
      <Space h={'lg'} />
      <Grid columns={12}>
        <Grid.Col span={{ base: 12, md: 12, lg: 8 }}>
          <Stack w={'100%'} h={'100%'} gap={'lg'}>
            <Paper
              shadow="md"
              bg={'yellow.5'}
              w={'100%'}
              h={'100%'}
              radius={'md'}
              style={{ overflow: 'hidden' }}
            >
              <BackgroundImage
                p={'md'}
                src={'icons/wave/yellow-wave.svg'}
                h={'100%'}
              >
                <Title mb={'md'} order={3} c={'white'}>
                  Арга хэмжээ
                </Title>
                <Flex justify={'space-between'} align={'center'} h={'100%'}>
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
                  <Group align="end" gap={'md'}>
                    <Text c={'yellow.1'} fz={'lg'} fw={500}>
                      Арга хэмжээ үүсгэх дээд хязгаар
                    </Text>
                    <Text c={'white'} fw={600} fz={98} lh={0.9}>
                      3
                    </Text>
                  </Group>
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
              <BackgroundImage
                p={'md'}
                src={'icons/wave/green-wave.svg'}
                h={'100%'}
              >
                <Title mb={'md'} order={3} c={'white'}>
                  Төсөл хөтөлбөр
                </Title>
                <Flex justify={'space-between'} align={'center'} h={'100%'}>
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
                  <Group align="end" gap={'md'}>
                    <Text c={'green.1'} fz={'lg'} fw={500}>
                      Төсөл хөтөлбөр үүсгэх дээд хязгаар
                    </Text>
                    <Text c={'white'} fw={600} fz={98} lh={0.9}>
                      3
                    </Text>
                  </Group>
                </Flex>
              </BackgroundImage>
            </Paper>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 12, lg: 4 }}>
          <BasicShop />
        </Grid.Col>
      </Grid>
    </Box>
  );
};
