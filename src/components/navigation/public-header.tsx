import {
  IconBalloon,
  IconCalendarCheck,
  IconCertificate,
  IconChevronDown,
  IconMenu2,
  IconUserHeart,
  IconUserHexagon,
  IconUsersGroup,
} from '@tabler/icons-react';
import Link from 'next/link';
import { DonateModal } from '../modal/donate-modal';
import { useState } from 'react';
import Image from 'next/image';
import ClosingIconX from '../icons/closingiconx';

const links = [
  {
    link: '#1',
    label: 'Платформ',
    links: [
      { link: '/projects', label: 'Projects', icon: <IconCalendarCheck /> },
      { link: '/events', label: 'Events', icon: <IconBalloon /> },
      {
        link: '/volunteering',
        label: 'Volunteering',
        icon: <IconCertificate />,
      },
      { link: '/supporters', label: 'Supporters', icon: <IconUserHexagon /> },
      { link: '/partners', label: 'Partners', icon: <IconUsersGroup /> },
      { link: '/volunteers', label: 'Volunteers', icon: <IconUserHeart /> },
    ],
  },
  {
    link: '/media',
    label: 'Медиа',
  },
  { link: '/about', label: 'Бидний тухай' },
  { link: '/auth', label: 'Нэвтрэх' },
  { link: '/projects', label: 'Donate' },
];

export const PublicHeader = () => {
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const [isNavOpened, setIsNavOpened] = useState(false);

  return (
    <header className="bg-white fixed w-full z-50 shadow-sm">
      <div className="container mx-auto flex flex-row justify-between py-[12px] items-center">
        <Link href="/">
          <div className="relative w-[168px] h-[42px]">
            <Image
              src="/images/home/foundation_logo.jpg"
              alt="foundation Logo"
              fill
              objectFit="contain"
            />
          </div>
        </Link>
        <button
          onClick={() => setIsNavOpened(prevState => !prevState)}
          className="md:hidden transition-all"
        >
          {isNavOpened ? <ClosingIconX /> : <IconMenu2 />}
        </button>
        <div className="absolute max-md:shadow-md right-0 top-[65px] w-full md:w-auto md:static">
          <div
            className={`bg-white flex-col gap-2 md:rounded border z-10 ${isNavOpened ? 'flex' : 'hidden'} md:flex md:flex-row md:static md:border-none md:w-auto`}
          >
            {links.map((link, index) => {
              if (link.label == 'Платформ') {
                return (
                  <button
                    onClick={() => setIsDropdownOpened(prevState => !prevState)}
                    className="transition all duration-500 ease-out px-[24px] py-[12px] text-lg font-semibold md:hover:bg-black/5 rounded-xl relative flex flex-col gap-1 text-left"
                    key={index}
                  >
                    <div>
                      {link.label}
                      <IconChevronDown
                        className={`inline transition-all ${isDropdownOpened && 'rotate-180'}`}
                        width="18px"
                        height="18px"
                      />
                    </div>
                    <div
                      className={`md:absolute bottom-0 pt-2 md:-bottom-3 md:p-5 md:left-1/2 md:translate-y-full transition-all duration-500 ease-out w-full md:w-[700px] md:-translate-x-1/2 rounded-xl border-none z-10 md:shadow md:bg-white ${isDropdownOpened ? 'grid sm:grid-cols-2' : 'hidden'} md:border`}
                    >
                      {link.links?.map((l, i) => (
                        <Link
                          href={l.link}
                          key={i}
                          className="flex  items-center rounded-xl px-3 py-1 md:py-3 gap-5 font-medium md:hover:bg-black/5 transition-all"
                        >
                          <div className="border p-2 rounded-xl">{l.icon}</div>
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </button>
                );
              }
              if (link.label === 'Donate') {
                return <DonateModal label={link.label} key={link.label} />;
              } else
                return (
                  <Link
                    key={index}
                    href={link.link}
                    className="px-[24px] py-[12px] text-lg font-semibold md:hover:bg-black/5 rounded-xl transition-all"
                  >
                    {link.label}
                  </Link>
                );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
