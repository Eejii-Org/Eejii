import { ProjectStatus, ProjectType } from '@/lib/db/enums';
import { api } from '@/utils/api';
import { Carousel } from '@mantine/carousel';
import { BackgroundImage, Button, Flex, Skeleton } from '@mantine/core';
import Link from 'next/link';

export const FeaturedProjects = () => {
  const { data: featuredProjects, isLoading } = api.project.findAll.useQuery({
    featured: true,
    limit: 5,
    status: ProjectStatus.APPROVED,
    type: ProjectType.FUNDRAISING,
    page: 1,
  });
  if (isLoading) {
    return <Skeleton h={360} radius={'lg'} w="100%" />;
  }
  return (
    <Carousel
      slideSize="100%"
      align="start"
      slideGap="md"
      controlsOffset="xs"
      controlSize={27}
      withIndicators
      loop
      dragFree
    >
      {featuredProjects && featuredProjects.items.length > 0
        ? featuredProjects.items.map((project, i) => {
            const image =
              process.env.NEXT_PUBLIC_AWS_PATH +
                '/' +
                project.Images.find(ei => ei.type === 'main')?.path ?? null;
            return (
              <Carousel.Slide key={i}>
                <BackgroundImage
                  h={360}
                  src={image}
                  radius={'lg'}
                  style={{ overflow: 'hidden' }}
                >
                  <Flex
                    direction={'column'}
                    align={'center'}
                    c={'white'}
                    h={'100%'}
                    justify={'center'}
                    style={{
                      backdropFilter: 'blur(10px)',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    <h2 className="text-lg font-semibold">
                      "{project.Categories[0]?.name}"
                    </h2>
                    <h1 className="pb-12 text-3xl font-semibold">
                      "{project.title}"
                    </h1>
                    <Button
                      component={Link}
                      href={`/projects/${project.slug}`}
                      className="h-[44px] w-[144px] rounded-none bg-primary"
                    >
                      Хандив өгөх
                    </Button>
                  </Flex>
                </BackgroundImage>
              </Carousel.Slide>
            );
          })
        : 'hi'}
    </Carousel>
  );
};
