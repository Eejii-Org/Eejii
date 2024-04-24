import React from 'react';
import { PublicFooter } from '../navigation/public-footer';
import { PublicHeader } from '../navigation/public-header';
import { useSession } from 'next-auth/react';
import { UserType } from '@/lib/db/enums';
import { HeaderV1 } from '../navigation/headerV1';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const session = useSession();
  const isVolunteer =
    session.status === 'authenticated' &&
    session.data.user.userType === UserType.USER_VOLUNTEER;
  return (
    <>
      {isVolunteer ? <HeaderV1 /> : <PublicHeader />}
      <div className="bg-[#FBFBFB]">{children}</div>
      <PublicFooter />
    </>
  );
}
