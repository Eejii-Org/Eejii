import {
  AppShell,
  Burger,
  Group,
  Avatar,
  Box,
  Button,
  Image,
  Menu,
  NavLink,
  Flex,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { signOut, useSession } from 'next-auth/react';
import {
  IconBrowser,
  IconCalendarCheck,
  IconCamera,
  IconChevronRight,
  IconConfetti,
  IconDoorExit,
  IconHome,
  IconTag,
  IconTags,
  IconUsers,
} from '@tabler/icons-react';

import Link from 'next/link';
import type { ReactNode } from 'react';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: <IconHome />,
    items: [],
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: <IconUsers />,
    items: [],
  },
  {
    title: 'Events',
    href: '/admin/events',
    icon: <IconConfetti />,
    items: [],
  },
  {
    title: 'Projects',
    href: '/admin/projects',
    icon: <IconCalendarCheck />,
    items: [],
  },
  {
    title: 'Category',
    href: '/admin/category',
    icon: <IconTag />,
    items: [],
  },
  {
    title: 'Banner',
    href: '/admin/banner',
    icon: <IconCamera />,
    items: [],
  },
  {
    title: 'Permits',
    href: '/admin/permits',
    icon: <IconTags />,
    items: [],
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const session = useSession();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Flex justify={'space-between'} align={'center'} h={'100%'} px="md">
          <Group h="100%">
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="sm"
            />
            <Image
              src="/images/home/foundation_logo.jpg"
              alt="foundation Logo"
              h={50}
              w={200}
              fit="contain"
            />
          </Group>
          <Menu width={200} position="bottom" offset={1} withArrow shadow="md">
            <Menu.Target>
              <Button
                visibleFrom="sm"
                c={'gray.7'}
                size="lg"
                px={0}
                fz={16}
                leftSection={<Avatar />}
                variant="transparent"
              >
                {session.data?.user.email}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconHome />}
                component={Link}
                href={'/admin'}
              >
                Dashboard
              </Menu.Item>
              <Menu.Item
                leftSection={<IconBrowser />}
                component={Link}
                href={'/'}
              >
                Eejii
              </Menu.Item>
              <Menu.Item
                onClick={() => signOut()}
                color="red"
                leftSection={<IconDoorExit />}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        {menuItems.map((item, i) => (
          <NavLink
            component={Link}
            href={item.href}
            key={i}
            leftSection={item.icon ?? <IconChevronRight />}
            // className="flex w-full transform flex-row items-center space-x-3 rounded-full bg-[#1E293B] p-2 pl-8 text-white duration-300 ease-in-out  hover:text-purple-500 dark:hover:text-blue-500"
            label={item.title}
          />
        ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <Box px={'lg'}>{children}</Box>
      </AppShell.Main>
    </AppShell>
  );
}
