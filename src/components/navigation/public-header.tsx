// import PublicLayout from '@/components/layout/public-layout';

import classes from '@/styles/Header.module.css';
import {
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  Container,
  Divider,
  Drawer,
  Group,
  Image,
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBalloon,
  IconCalendarCheck,
  IconCertificate,
  IconChevronDown,
  IconUserHeart,
  IconUserHexagon,
  IconUsersGroup,
} from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { DonateModal } from '../modal/donate-modal';

const HoverCard = dynamic(
  () => import('@mantine/core').then(el => el.HoverCard),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);
const HoverCardTarget = dynamic(
  () => import('@mantine/core').then(el => el.HoverCardTarget),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);
const HoverCardDropdown = dynamic(
  () => import('@mantine/core').then(el => el.HoverCardDropdown),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

const links = [
  {
    link: '#1',
    label: 'Platform',
    links: [
      { link: '/projects', label: 'Projects', icon: IconCalendarCheck },
      { link: '/events', label: 'Events', icon: IconBalloon },
      { link: '/volunteering', label: 'Volunteering', icon: IconCertificate },
      { link: '/supporters', label: 'Supporters', icon: IconUserHexagon },
      { link: '/partners', label: 'Partners', icon: IconUsersGroup },
      { link: '/volunteers', label: 'Volunteers', icon: IconUserHeart },
    ],
  },
  {
    link: '/media',
    label: 'Media',
  },
  { link: '/about', label: 'About' },
  { link: '/auth', label: 'Login' },
  { link: '/projects', label: 'Donate' },
];

export const PublicHeader = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);

  const items = links.map(link => {
    const menuItems = link.links?.map(item => (
      <UnstyledButton
        component={Link}
        href={item.link}
        className={classes.subLink}
        key={item.label}
      >
        <Group wrap="nowrap" align="flex-start">
          <ThemeIcon size={34} variant="default" radius="md">
            <item.icon style={{ width: rem(22), height: rem(22) }} />
          </ThemeIcon>
          <div>
            <Text size="sm" fw={500}>
              {item.label}
            </Text>
          </div>
        </Group>
      </UnstyledButton>
    ));

    if (menuItems) {
      return (
        <HoverCard
          width={600}
          key={link.label}
          position="bottom"
          radius="md"
          shadow="md"
          withinPortal
        >
          <HoverCardTarget>
            <a href="#" className={classes.link}>
              <Center inline>
                <Box component="span" mr={5}>
                  {link.label}
                </Box>
                <IconChevronDown style={{ width: rem(16), height: rem(16) }} />
              </Center>
            </a>
          </HoverCardTarget>

          <HoverCardDropdown style={{ overflow: 'hidden' }}>
            <SimpleGrid cols={2} spacing={0}>
              {menuItems}
            </SimpleGrid>
          </HoverCardDropdown>
        </HoverCard>
      );
    }

    if (link.label === 'Donate') {
      return <DonateModal label={link.label} key={link.label} />;
    }
    return (
      <Link key={link.label} href={link.link} className={classes.link}>
        {link.label}
      </Link>
    );
  });

  return (
    <header className={classes.header}>
      <Container size="xl">
        <div className={classes.inner}>
          <Link href={'/'}>
            <Image
              src="/images/home/foundation_logo.jpg"
              alt="foundation Logo"
              h={70}
              w={200}
              fit="contain"
            />
          </Link>
          <Group gap={5} visibleFrom="sm">
            {items}
          </Group>
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            size="sm"
            hiddenFrom="sm"
          />
        </div>
      </Container>
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />
          {links.map(link => {
            if (link.links) {
              return (
                <UnstyledButton key={link.label} w={'100%'}>
                  <UnstyledButton
                    className={classes.link}
                    onClick={toggleLinks}
                  >
                    <Center inline>
                      <Box component="span" mr={5}>
                        {link.label}
                      </Box>
                      <IconChevronDown
                        style={{ width: rem(16), height: rem(16) }}
                      />
                    </Center>
                  </UnstyledButton>
                  <Collapse in={linksOpened}>
                    {link.links.map(l => (
                      <UnstyledButton className={classes.subLink} key={l.label}>
                        <Group wrap="nowrap" align="flex-start">
                          <ThemeIcon size={34} variant="default" radius="md">
                            <l.icon
                              style={{ width: rem(22), height: rem(22) }}
                            />
                          </ThemeIcon>
                          <div>
                            <Text size="sm" fw={500}>
                              {l.label}
                            </Text>
                            {/* <Text size="xs" c="dimmed">
                              {item.description}
                            </Text> */}
                          </div>
                        </Group>
                      </UnstyledButton>
                    ))}
                  </Collapse>
                </UnstyledButton>
              );
            }
            return (
              <Link key={link.label} href={link.link} className={classes.link}>
                {link.label}
              </Link>
            );
          })}
          <Divider my="sm" />
          <Group justify="center" grow pb="xl" px="md">
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </header>
  );
};
