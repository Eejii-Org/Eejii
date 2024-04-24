import React from 'react';
import Image from 'next/image';
import { ActionIcon, Container } from '@mantine/core';

import { useRouter } from 'next/router';
import { IconArrowLeft } from '@tabler/icons-react';
const AuthLayout = ({
  children,
  indexPage,
}: {
  children: React.ReactNode;
  indexPage?: boolean;
}) => {
  const router = useRouter();
  return (
    <div>
      <Container className="h-screen">
        <div className="relative mx-auto flex w-full max-w-2xl justify-center p-5">
          <div className="absolute left-0 top-7">
            <ActionIcon
              radius={'lg'}
              size={'lg'}
              variant="light"
              onClick={() => router.back()}
            >
              <IconArrowLeft />
            </ActionIcon>
          </div>
          <Image
            src="/images/login/foundationLogo.png"
            width={189}
            height={60}
            alt="logo"
          />
        </div>
        <div className="mx-auto mt-10 flex max-w-2xl flex-col justify-center lg:mt-32">
          {indexPage && (
            <div className="mb-5 w-full text-center font-semibold">
              <h1 className="pb-5 pt-6 text-2xl text-primary">Хамтдаа</h1>
              <h1 className="text-2xl text-primary">
                Хайр дүүрэн ертөнцийг бүтээе
              </h1>
            </div>
          )}
          {children}
        </div>
      </Container>
    </div>
  );
};

export default AuthLayout;
