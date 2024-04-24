import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactElement } from 'react';

import { Button, rem, MenuItem } from '@mantine/core';
import {
  IconLogout,
  IconMessageCircle,
  IconPhoto,
  IconSettings,
  IconUser,
} from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import { signOut, useSession } from 'next-auth/react';

const Menu = dynamic(() => import('@mantine/core').then(el => el.Menu), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

const MenuLabel = dynamic(
  () => import('@mantine/core').then(el => el.MenuLabel),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

const MenuTarget = dynamic(
  () => import('@mantine/core').then(el => el.MenuTarget),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

const MenuDropdown = dynamic(
  () => import('@mantine/core').then(el => el.MenuDropdown),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

const MenuDivider = dynamic(
  () => import('@mantine/core').then(el => el.MenuDivider),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

interface HeaderProps {
  title: string;
  href: string;
  icon: ReactElement;
  items: string[];
  external: string;
}

const HeaderV2 = ({
  headerNav,
  open,
}: {
  headerNav: HeaderProps[] | [];
  open: boolean;
}) => {
  const session = useSession();
  const pathname = usePathname();

  return (
    <header
      className={`fixed left-0 right-0 top-0 ms-[80px] px-4 ${
        open ? ' sm:ms-[300px]' : ' sm:ms-[80px]'
      } z-10 flex h-[80px] items-center justify-between border-b border-gray-200 bg-white`}
    >
      <div>
        <Image
          alt="logo"
          src={'/images/home/eejii.jpeg'}
          width={160}
          height={50}
        />
      </div>

      <nav>
        <ul className="flex flex-row gap-10">
          {headerNav && headerNav.length > 0 ? (
            headerNav.map((item, index) => (
              <li key={index}>
                <Button
                  variant="link"
                  className={`${pathname === item.href ? 'underline' : ''}`}
                >
                  <Link href={item.href}>{item.title}</Link>
                </Button>
              </li>
            ))
          ) : (
            <></>
          )}
        </ul>
      </nav>
      <div>
        {session && (
          <Menu width={200}>
            <MenuTarget>
              <Button leftSection={<IconUser />} variant="transparent">
                {session.data?.user.name ?? session.data?.user.email}
              </Button>
            </MenuTarget>

            <MenuDropdown>
              <MenuLabel>Application</MenuLabel>
              <MenuItem
                leftSection={
                  <IconSettings style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Settings
              </MenuItem>
              <MenuItem
                leftSection={
                  <IconMessageCircle
                    style={{ width: rem(14), height: rem(14) }}
                  />
                }
              >
                Messages
              </MenuItem>
              <MenuItem
                leftSection={
                  <IconPhoto style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Gallery
              </MenuItem>
              <MenuDivider />
              <MenuItem
                color="red"
                onClick={() => signOut()}
                leftSection={
                  <IconLogout style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Logout
              </MenuItem>
            </MenuDropdown>
          </Menu>
        )}
      </div>
    </header>
  );
};

export default HeaderV2;
