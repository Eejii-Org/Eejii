import { PermitType } from '@/lib/db/enums';
import { api } from '@/utils/api';
import { CarouselSlide, Carousel } from '@mantine/carousel';
import { Flex, Text, Grid, Paper, Title, Box, Skeleton } from '@mantine/core';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { PermitCard } from './permit-card';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import type { Permit } from '@/lib/db/types';

export const BasicShop = () => {
  const autoplay = useRef(Autoplay({ delay: 8000 }));
  const { data: projectPermits, isLoading: isProjectPermitLoading } =
    api.permit.findAll.useQuery({
      type: PermitType.PROJECT,
      page: 1,
      limit: 100,
    });
  const { data: eventPermits, isLoading: isEventPermitLoading } =
    api.permit.findAll.useQuery({
      type: PermitType.EVENT,
      page: 1,
      limit: 100,
    });

  return (
    <Paper radius={'md'} shadow="md" p={'lg'} bg={'primary'} h="100%">
      <Title mb={'md'} order={3} c={'white'}>
        Shop
      </Title>
      <Grid grow>
        <Grid.Col span={12}>
          <Carousel
            slideGap={'md'}
            slideSize={'100%'}
            styles={{
              indicator: {
                color: 'black',
                backgroundColor: 'black',
              },
            }}
            nextControlIcon={<IconArrowRight size={20} />}
            previousControlIcon={<IconArrowLeft size={20} />}
            controlSize={30}
            loop
            withIndicators
            height={'100%'}
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
          >
            {isEventPermitLoading && (
              <CarouselSlide>
                <Paper
                  bg={'white'}
                  p={'md'}
                  w={'99%'}
                  component="button"
                  onClick={() => alert('hii')}
                >
                  <Box>
                    <Skeleton visible={true} height={200} width={350} />
                    <Skeleton
                      visible={true}
                      height={20}
                      mt={'md'}
                      width={100}
                    />
                    <Flex justify={'end'} mt={'md'} align={'center'}>
                      <Text size="lg" fw={600} c={'dimmed'}>
                        <Skeleton visible={true} height={40} width={200} />
                      </Text>
                    </Flex>
                  </Box>
                </Paper>
              </CarouselSlide>
            )}
            {eventPermits &&
              eventPermits.items.length > 0 &&
              eventPermits.items.map((eventPermit, i) => (
                <CarouselSlide key={i}>
                  <PermitCard permit={eventPermit as unknown as Permit} />
                </CarouselSlide>
              ))}
          </Carousel>
        </Grid.Col>
        <Grid.Col span={12}>
          <Carousel
            slideGap={'md'}
            slideSize={'100%'}
            styles={{
              indicator: {
                color: 'black',
                backgroundColor: 'black',
              },
            }}
            nextControlIcon={<IconArrowRight size={20} />}
            previousControlIcon={<IconArrowLeft size={20} />}
            controlSize={30}
            loop
            withIndicators
            height={'100%'}
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
          >
            {isProjectPermitLoading && (
              <CarouselSlide>
                <Paper
                  bg={'white'}
                  p={'md'}
                  w={'99%'}
                  component="button"
                  onClick={() => alert('hii')}
                >
                  <Box>
                    <Skeleton visible={true} height={200} width={350} />
                    <Skeleton
                      visible={true}
                      height={20}
                      mt={'md'}
                      width={100}
                    />
                    <Flex justify={'end'} mt={'md'} align={'center'}>
                      <Text size="lg" fw={600} c={'dimmed'}>
                        <Skeleton visible={true} height={40} width={200} />
                      </Text>
                    </Flex>
                  </Box>
                </Paper>
              </CarouselSlide>
            )}
            {projectPermits &&
              projectPermits.items.length > 0 &&
              projectPermits.items.map((projectPermit, i) => (
                <CarouselSlide key={i}>
                  <PermitCard permit={projectPermit as unknown as Permit} />
                </CarouselSlide>
              ))}
          </Carousel>
        </Grid.Col>
        {/* <Grid.Col span={12}></Grid.Col> */}
      </Grid>
    </Paper>
  );
};
