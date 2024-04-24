import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

import { useForm, zodResolver } from '@mantine/form';

import { Button, PasswordInput, TextInput, Flex } from '@mantine/core';
import { loginSchema } from '@/lib/validation/user-schema';
import { notifications } from '@mantine/notifications';
import type { z } from 'zod';
import { IconBrandFacebook } from '@tabler/icons-react';

// Define the type for the form data
type FormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    validate: zodResolver(loginSchema),
  });

  //TODO social auth
  const signInHandler = async (values: FormData) => {
    setLoading(true);
    const { email, password } = values;

    await signIn('credentials', { email, password, redirect: false }).then(
      data => {
        if (data?.error) {
          setLoading(false);
          switch (data.error) {
            case 'CredentialsSignin':
              return setError('Invalid credentials!');
            default:
              return setError('Something went wrong!');
          }
        }

        notifications.show({
          title: 'Success',
          message: 'Login success',
        });
        setLoading(false);

        // router.push(`/${checkUserType()}`);
      }
    );
  };

  //TODO design ii daguu tsarailag bolgoh

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 px-20 py-10">
      <button className="flex h-12 w-[359px] rounded-full  border-2 border-hidden bg-[#F3F9FA]">
        <span className="m-auto flex items-center">
          <Link className="text-brand500 content-center text-3xl" href="/">
            <IconBrandFacebook />
          </Link>
          Sign in with Facebook
        </span>
      </button>
      <p className="h-37 mt-4">
        By continiung with Facebook Apple, you agree to the{' '}
        <a href="#" className="text-primary hover:underline">
          {' '}
          Terms of <br /> Use{' '}
        </a>{' '}
        and consent the prcoessing of your personal data according <br /> to the{' '}
        <a href="#" className="text-primary hover:underline">
          Privacy Policy
        </a>
      </p>
      <div className="relative">
        <h1>or</h1>
      </div>

      <form onSubmit={form.onSubmit(signInHandler)} className="w-full">
        <Flex w="100%" gap="md" direction="column" align={'center'}>
          <TextInput
            className="border-b"
            w="100%"
            placeholder="Email"
            variant="unstyled"
            {...form.getInputProps('email')}
          />
          <PasswordInput
            className="border-b"
            w="100%"
            placeholder="Password"
            variant="unstyled"
            {...form.getInputProps('password')}
          />
          {error !== '' && <div className="pt-4 text-red-600">{error}</div>}

          <Button
            type="submit"
            color="primary"
            radius="xl"
            size="md"
            loading={loading}
            fullWidth
            loaderProps={{ type: 'dots' }}
          >
            Log in
          </Button>
          <Link href={'/auth/signup'}>
            <Button color="primary" variant={'subtle'} radius="xl">
              New account
            </Button>
          </Link>
        </Flex>
      </form>
    </div>
  );
}
