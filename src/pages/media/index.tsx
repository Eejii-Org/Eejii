import PublicLayout from '@/components/layout/public-layout';
import { PublicMediaList } from '@/components/media/list';
import { MediaSidebar } from '@/components/media/sidebar';
import {
  ActionIcon,
  Container,
  Flex,
  Grid,
  Space,
  TextInput,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Index() {
  const [search, setSearch] = useState('');
  const router = useRouter();
  return (
    <PublicLayout>
      <Space h={'xl'} />
      <Container size={'xl'}>
        <Grid columns={16}>
          <Grid.Col span={{ base: 16, lg: 12 }}>
            <Flex justify={'space-between'} gap={20}>
              <TextInput
                placeholder="Search..."
                radius={'xl'}
                size="lg"
                onChange={e => {
                  e.preventDefault();
                  setSearch(e.currentTarget.value);
                }}
                w={'100%'}
                rightSection={
                  <ActionIcon
                    variant="transparent"
                    onClick={() => {
                      router.push({
                        pathname: router.pathname,
                        query: { ...router.query, q: search },
                      });
                    }}
                  >
                    <IconSearch />
                  </ActionIcon>
                }
              />
            </Flex>
            <Space h={'lg'} />
            <PublicMediaList />
          </Grid.Col>
          <Grid.Col span={{ base: 16, lg: 4 }}>
            <MediaSidebar />
          </Grid.Col>
        </Grid>
      </Container>
    </PublicLayout>
  );
}
