import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import LoginForm from '@/components/form/login-form';
import { UserType } from '@/lib/db/enums';
import AuthLayout from '@/components/layout/auth-layout';

export default function Auth() {
  const session = useSession();
  const router = useRouter();

  function checkUserType(userTypeProp: UserType) {
    if (userTypeProp == UserType.USER_VOLUNTEER) return 'v';
    if (userTypeProp == UserType.USER_PARTNER) return 'p';
    if (userTypeProp == UserType.USER_SUPPORTER) return 's';
    return;
  }

  useEffect(() => {
    if (session.data != null) {
      router.push(`/${checkUserType(session.data.user.userType)}`);
    }
  }, [session]);

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
