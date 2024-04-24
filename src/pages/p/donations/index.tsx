import PartnerLayout from '@/components/layout/partner-layout';
import { DonationTable } from '@/components/partner/donation/table';
import type { MyDonation } from '@/lib/types';
import { api } from '@/utils/api';
import {
  BackgroundImage,
  Container,
  Flex,
  Paper,
  Space,
  Text,
} from '@mantine/core';

export default function Donations() {
  const { data: donations, isLoading } = api.user.getMyDonations.useQuery({
    limit: 10,
  });

  return (
    <PartnerLayout>
      <Container fluid p={'xl'}>
        <BackgroundImage
          src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80"
          radius="sm"
          h={300}
        >
          <Flex p="md" justify={'start'} align={'center'}>
            <Text c="white" fz={'xl'} fw={700}>
              Donations
            </Text>
          </Flex>
        </BackgroundImage>
        <Space h={'lg'} />
        <Paper shadow="sm" p={10} withBorder>
          <DonationTable
            donations={donations as unknown as MyDonation[]}
            isLoading={isLoading}
          />
        </Paper>
      </Container>
    </PartnerLayout>
  );
}
