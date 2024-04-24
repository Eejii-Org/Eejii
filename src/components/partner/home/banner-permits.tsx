import { FallbackImage } from '@/components/common/fallback-image';
import { Box, Text, Group, Paper, Stack, Title, Button } from '@mantine/core';

export const BannerPermits = () => {
  return (
    <Stack>
      <Title order={3}>Суртчилгаа</Title>
      <Paper bg={'white'} radius={'md'} style={{ overflow: 'hidden' }}>
        <Group justify="space-between" grow>
          <Box>
            <FallbackImage
              height={300}
              width={400}
              fullWidth
              src={''}
              alt="img"
            />
          </Box>
          <Stack w={'100%'} justify="end" p={'md'}>
            <Text>
              Энэ хэсгийн сурталчилгааны хэсэг нь 1440x553 /мм/ хэмжээтэй бөгөөд
              та нийт 5 өөр сурталчилгааг нэг дор байршуулж болох буюу өөрөө
              автоматаар солигдох байдлаар харагдана
            </Text>
            <Group grow>
              <Button radius={'lg'} variant="outline" color="red">
                Устгах
              </Button>
              <Button radius={'lg'} color="primary">
                Устгах
              </Button>
            </Group>
          </Stack>
        </Group>
      </Paper>
    </Stack>
  );
};
