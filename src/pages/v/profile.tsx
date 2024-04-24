import { useSession } from 'next-auth/react';

import PublicLayout from '@/components/layout/public-layout';
import { ActionIcon, Container, Flex, LoadingOverlay } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { InfoForm } from '@/components/volunteer/profile/info-form';
import { BioForm } from '@/components/volunteer/profile/bio-form';
import { api } from '@/utils/api';
import type { User } from '@/lib/types';
import { PasswordForm } from '@/components/volunteer/profile/password-form';

const Profile = () => {
  const { data } = useSession();
  const { data: volunteer, isLoading } = api.volunteer.findById.useQuery({
    id: data?.user.id as string,
  });
  return (
    <PublicLayout>
      {!isLoading ? (
        volunteer && (
          <Container size={'lg'} bg={'white'} p="xl" mt={'lg'}>
            <Flex justify={'start'} gap={10} mb={10}>
              <ActionIcon
                component={Link}
                href={'/v'}
                radius={'xl'}
                size={'xl'}
                variant="light"
              >
                <IconArrowLeft />
              </ActionIcon>
            </Flex>
            <InfoForm volunteer={volunteer as unknown as User} />
            <BioForm volunteer={volunteer as unknown as User} />
            <PasswordForm volunteer={volunteer as unknown as User} />
          </Container>
        )
      ) : (
        <LoadingOverlay />
      )}
    </PublicLayout>
  );
};

export default Profile;
