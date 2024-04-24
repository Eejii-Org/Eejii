import { useRouter } from 'next/router';
import {
  useEffect,
  useState,
  type Dispatch,
  type ReactElement,
  type SetStateAction,
} from 'react';

import { Button, NavLink } from '@mantine/core';
import Link from 'next/link';
import { IconAlignLeft, IconAlignRight } from '@tabler/icons-react';
interface SidebarProps {
  title: string;
  href: string;
  icon: ReactElement;
  items: string[];
  external: string;
  slug: string;
}
export default function Sidebar({
  sidebarNav,
  open,
  setOpen,
}: {
  sidebarNav: SidebarProps[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [active, setActive] = useState('Dashboard');
  useEffect(() => {
    const currentPath = router.asPath.split('?')[0]?.split('/')[2];

    const activeItem = sidebarNav.find(item => {
      return item.slug === currentPath;
    });

    if (activeItem) {
      setActive(activeItem.title);
    }
  }, [router.asPath]);

  return (
    <div
      className={`
        sidebar
        no-scrollbar
        top-30
        bottom-0
        z-10
        w-[80px] overflow-y-auto
        px-3
        pb-10
        text-center
        sm:w-[300px]
        lg:left-0
        ${open ? '' : 'sm:w-[80px]'}
      `}
    >
      <div className="flex h-[80px] items-center justify-center">
        {/* <span className="text-3xl">{open ? 'Eejii' : 'E'}</span> */}
      </div>
      <div className="flex flex-col space-y-2">
        <div className={`${open ? 'flex justify-end' : 'flex'}`}>
          <Button
            onClick={() => setOpen(!open)}
            variant={'ghost'}
            visibleFrom="sm"
          >
            {open ? <IconAlignRight /> : <IconAlignLeft />}
          </Button>
        </div>
        {sidebarNav &&
          sidebarNav?.map((item, index) => {
            return item.href ? (
              <NavLink
                component={Link}
                label={item.title}
                href={item.href}
                active={active == item.title}
                p={10}
                key={index}
                leftSection={item.icon}
              />
            ) : (
              // <Link
              //   key={index}
              //   href={item.href}
              //   target={item.external ? '_blank  ' : ''}
              //   rel={item.external ? 'noreferrer' : ''}
              // >
              //   <span
              //     className={cn(
              //       `group flex w-full items-center gap-2 rounded-md border border-transparent px-2 py-2 hover:bg-muted`,
              //       active == item.title
              //         ? 'bg-primary font-medium text-popover'
              //         : 'text-sidebar-foreground'
              //     )}
              //   >
              //     {/* <Icon className="mr-2 h-4 w-4" aria-hidden="true" /> */}
              //     {item.icon ?? <ChevronRight className="mr-2 h-10 w-10" />}
              //     {open && <span>{item.title}</span>}
              //   </span>
              // </Link>
              <span
                key={index}
                className="flex w-full cursor-not-allowed items-center rounded-md p-2 text-gray-100 hover:underline"
              >
                {item.title}
              </span>
            );
          })}
      </div>
    </div>
  );
}
