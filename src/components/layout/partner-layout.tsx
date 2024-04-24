import { useState } from 'react';

import HeaderV2 from '../navigation/headerV2';
import Sidebar from '../navigation/sidebar';
import {
  IconCalendarCheck,
  IconHeart,
  IconLayoutDashboard,
  IconPdf,
  IconSettings,
} from '@tabler/icons-react';

interface PartnerLayoutProps {
  children: React.ReactNode;
}

export default function PartnerLayout({ children }: PartnerLayoutProps) {
  const sidebarNav = [
    {
      title: 'Dashboard',
      href: '/p',
      slug: '',
      icon: <IconLayoutDashboard className="ml-1 mr-1 h-7 w-7" />,
      items: [],
      external: '',
    },
    {
      title: 'Manage Projects',
      href: '/p/projects',
      slug: 'projects',
      icon: <IconCalendarCheck className="ml-1 mr-1 h-7 w-7" />,
      items: [],
      external: '',
    },
    {
      title: 'Manage Events',
      href: '/p/events',
      slug: 'events',
      icon: <IconCalendarCheck className="ml-1 mr-1 h-7 w-7" />,
      items: [],
      external: '',
    },
    {
      title: 'Donations',
      href: '/p/donations',
      slug: 'donations',
      icon: <IconHeart className="ml-1 mr-1 h-7 w-7" />,
      items: [],
      external: '',
    },
    {
      title: 'Media',
      href: '/p/media',
      slug: 'media',
      icon: <IconPdf className="ml-1 mr-1 h-7 w-7" />,
      items: [],
      external: '',
    },
    {
      title: 'Settings',
      href: '/p/settings',
      slug: 'settings',
      icon: <IconSettings className="ml-1 mr-1 h-7 w-7" />,
      items: [],
      external: '',
    },
  ];
  const [open, setOpen] = useState(true);

  return (
    <div className="">
      <div className="flex">
        <div className="fixed z-20 h-screen flex-none border-r bg-white text-sidebar-foreground">
          <Sidebar open={open} setOpen={setOpen} sidebarNav={sidebarNav} />
        </div>
        <div className={`grow ${open ? 'sm:ms-[300px]' : 'ms-[80px]'} `}>
          <HeaderV2 open={open} headerNav={[]} />
          <div className="bg-brand450  pb-0 pt-20">{children}</div>
        </div>
      </div>
    </div>
  );
}
