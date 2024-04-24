import AuthLayout from '@/components/layout/auth-layout';
import Link from 'next/link';

export default function Index() {
  return (
    <AuthLayout indexPage>
      <div className="w-full text-center text-sm leading-10 pb-14 text-primary">
        <Link href={'/auth/login'}>
          <button className="px-24 py-1 font-bold border-2 rounded-full border-primary">
            Log in
          </button>
        </Link>
        <p>or</p>
        <Link href={'/auth/signup'}>
          <button className="px-24 py-1 font-bold border-2 rounded-full border-primary ">
            Sign up
          </button>
        </Link>
      </div>
    </AuthLayout>
  );
}
