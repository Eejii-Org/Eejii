import PartnerLayout from '@/components/layout/partner-layout';
import { BioForm } from '@/components/partner/profile/bio-form';
import { ContactForm } from '@/components/partner/profile/contact-form';
import type { User } from '@/lib/types';
import { api } from '@/utils/api';
import {
  Container,
  Divider,
  Skeleton,
  Space,
  Stack,
  Title,
} from '@mantine/core';

export default function Profile() {
  const { data: user, isLoading } = api.user.getMe.useQuery();
  return (
    <PartnerLayout>
      <Container fluid p={'xl'}>
        <Title order={1}>Profile</Title>
        <Divider my={20} />
        {!isLoading && user ? (
          <>
            <BioForm user={user as unknown as User} />
            <Space h={'lg'} />
            <ContactForm user={user as unknown as User} />
          </>
        ) : (
          <Stack>
            <Skeleton h={400} w={'100%'} radius={'lg'} />
            <Skeleton h={400} w={'100%'} radius={'lg'} />
          </Stack>
        )}
      </Container>
    </PartnerLayout>
  );
}
