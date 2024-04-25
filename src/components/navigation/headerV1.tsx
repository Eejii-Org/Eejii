import classes from '@/styles/HeaderV1.module.css';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

import {
  ActionIcon,
  Autocomplete,
  Avatar,
  Burger,
  Button,
  Container,
  Divider,
  Drawer,
  Group,
  NavLink,
  ScrollArea,
  rem,
  Menu,
} from '@mantine/core';
import {
  IconBellFilled,
  IconCalendarCheck,
  IconDoorExit,
  IconLayoutDashboard,
  IconSearch,
  IconUser,
  IconUserCog,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

const headerNav = [
  {
    title: 'Нүүр',
    href: '/v',
    slug: '',
    icon: <IconLayoutDashboard className='"mr-2 w-4" h-4' />,
    items: [],
    external: '',
  },
  {
    title: 'Төсөл хөтөлөр',
    href: '/events',
    slug: 'events',
    icon: <IconCalendarCheck className='"mr-2 w-4" h-4' />,
    items: [],
    external: '',
  },
  {
    title: 'Хандив',
    href: '/projects',
    slug: 'projects',
    icon: <IconCalendarCheck className='"mr-2 w-4" h-4' />,
    items: [],
    external: '',
  },
  {
    title: 'Гэр бүл',
    href: '/v/family',
    slug: 'family',
    icon: <IconUserCog className='"mr-2 w-4" h-4' />,
    items: [],
    external: '',
  },
];
export const HeaderV1 = () => {
  const router = useRouter();
  const session = useSession();
  const [active, setActive] = useState('');
  const [opened, { toggle, close }] = useDisclosure(false);

  useEffect(() => {
    let currentPath = router.asPath.split('?')[0]?.split('/')[1];
    if (currentPath === 'v') {
      currentPath = router.asPath.split('?')[0]?.split('/')[2];
    }

    const activeItem = headerNav.find(item => {
      return item.slug === currentPath;
    });

    if (activeItem) {
      setActive(activeItem.slug);
    }
  }, [router.asPath]);
  return (
    <header className={classes.header}>
      <Container size={'xl'}>
        <div className={classes.inner}>
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              size="sm"
              hiddenFrom="lg"
            />
            <Image
              alt="logo"
              src={'/images/foundation_logo.png'}
              width={160}
              height={50}
            />
            <Group ml={50} gap={5} className={classes.links} visibleFrom="lg">
              {headerNav.map(link => (
                <Link
                  key={link.slug}
                  href={link.href}
                  className={
                    active === link.slug ? classes.activeLink : classes.link
                  }
                >
                  {link.title}
                </Link>
              ))}
            </Group>
          </Group>

          <Group align={'center'} gap={30} visibleFrom="md">
            <Autocomplete
              radius={'lg'}
              className={classes.search}
              placeholder="Search"
              leftSection={
                <IconSearch
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              }
              data={[
                'React',
                'Angular',
                'Vue',
                'Next.js',
                'Riot.js',
                'Svelte',
                'Blitz.js',
              ]}
              visibleFrom="xs"
            />
          </Group>
          <Group align={'center'} gap={30}>
            <ActionIcon
              size={'lg'}
              radius={'lg'}
              variant="outline"
              color="gray.7"
            >
              <IconBellFilled />
            </ActionIcon>
            <Menu
              width={200}
              position="bottom"
              offset={1}
              withArrow
              shadow="md"
            >
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
                  leftSection={<IconUser />}
                  component={Link}
                  href={'/v'}
                >
                  Profile
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
          </Group>
        </div>
      </Container>
      <Drawer
        opened={opened}
        onClose={close}
        size="100%"
        padding="md"
        title={
          <Image
            alt="logo"
            src={'/images/foundation_logo.jpg'}
            width={160}
            height={50}
          />
        }
        hiddenFrom="lg"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider mb="sm" />
          {headerNav.map(nav => (
            <NavLink href={nav.href} key={nav.slug} label={nav.title} />
          ))}
          <Divider my="sm" />
          {session.status === 'authenticated' ? (
            <div>
              <NavLink
                component={Link}
                href={'/v'}
                leftSection={<IconUser />}
                label={session.data.user.email}
              />
              <NavLink
                href="#"
                variant="light"
                c="red"
                leftSection={<IconDoorExit />}
                label={'Logout'}
              />
            </div>
          ) : (
            <Group justify="center" grow pb="xl" px="md">
              <Button variant="default">Log in</Button>
              <Button onClick={() => signOut()}>Sign up</Button>
            </Group>
          )}
        </ScrollArea>
      </Drawer>
    </header>
  );
};
