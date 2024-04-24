import PartnerLayout from '@/components/layout/partner-layout';
import { MediaList } from '@/components/partner/media/media-list';
import {
  BackgroundImage,
  Button,
  Container,
  Flex,
  Space,
  Text,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';

export default function Media() {
  return (
    <PartnerLayout>
      <Container fluid p={'xl'}>
        <BackgroundImage
          src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80"
          radius="sm"
          h={300}
        >
          <Flex p="md" justify={'space-between'} align={'center'}>
            <Text c="white" fz={'xl'} fw={700}>
              Media
            </Text>
            <Button
              component={Link}
              href={'/p/media/new'}
              size="lg"
              radius={'xl'}
              c="white"
              fz={'lg'}
              leftSection={<IconPlus />}
            >
              Add media
            </Button>
          </Flex>
        </BackgroundImage>
        <Space h={'lg'} />
        <MediaList />
      </Container>
    </PartnerLayout>
  );
}
