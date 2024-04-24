import { api } from '@/utils/api';
import { Carousel, CarouselSlide } from '@mantine/carousel';
import { PermitCard } from './permit-card';
import { Paper, Title, Text, Flex, Box, Skeleton } from '@mantine/core';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import type { Permit } from '@/lib/db/types';

export const StandartShop = () => {
  const autoplay = useRef(Autoplay({ delay: 8000 }));
  const { data: permits, isLoading } = api.permit.findAll.useQuery({
    page: 1,
    limit: 100,
  });

  return (
    <Paper radius={'md'} shadow="md" p={'lg'} bg={'primary'} h="100%">
      <Title mb={'md'} order={3} c={'white'}>
        Shop
      </Title>
      <Carousel
        slideGap={'md'}
        slideSize={'100%'}
        styles={{
          controls: {
            top: -47,
            justifyContent: 'end',
            gap: '10px',
            position: 'absolute',
          },
          control: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
            border: 0,
            boxShadow: 'inset 0 0 0 0.1rem var(--mantine-color-white)',
            color: 'white',
          },
          indicators: {
            bottom: 0,
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
        {isLoading && (
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
                <Skeleton visible={true} height={20} mt={'md'} width={100} />
                <Flex justify={'end'} mt={'md'} align={'center'}>
                  <Text size="lg" fw={600} c={'dimmed'}>
                    <Skeleton visible={true} height={40} width={200} />
                  </Text>
                </Flex>
              </Box>
            </Paper>
          </CarouselSlide>
        )}
        {permits &&
          permits.items &&
          permits.items.length > 0 &&
          permits.items.map((permit, i) => (
            <CarouselSlide key={i}>
              <PermitCard permit={permit as unknown as Permit} />
            </CarouselSlide>
          ))}
      </Carousel>
    </Paper>
  );
};
