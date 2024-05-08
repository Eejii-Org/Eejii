// import type { Media } from '@/lib/types';
import { IconArrowLeft } from '@tabler/icons-react';
// import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';

// media-гаа авахгүй байсан тул гараар content орууллаа.

export const MediaDetail = () =>
  // { media }: { media: Media }
  {
    // const image =
    //   process.env.NEXT_PUBLIC_AWS_PATH + '/' + media?.Images?.[0]?.path;
    return (
      <section>
        <Image
          // src={image}
          src={'/images/home/backGroundImg.png'}
          width={1200}
          height={329}
          className="md:rounded-[20px] w-full h-[329px] object-cover"
          alt="Media Background IMG"
        />
        <div className="w-full mx-auto">
          <div className="container px-10 py-7 sm:px-[64px] sm:py-[48px] bg-white relative mx-auto shadow-sm rounded-2xl md:max-w-[800px] xs:-mt-28 md:-mt-44">
            <header className="flex flex-col gap-1 mb-6">
              <h5 className="font-bold text-[30px] mb-2">
                {/* {media.title} */}
                Media Title Media Title Media Title
              </h5>
              <div className="flex items-center gap-2 justify-between">
                <div className="flex gap-2">
                  <Image
                    width={25}
                    height={25}
                    src={'/images/volunteer/volunteer_logo.png'}
                    alt="publisher's avatar"
                  />
                  <p className="font-semibold text-xl text-black/60">
                    {/* {media.Owner.organizationName ?? media.Owner.email} */}
                    Тэмүүжин
                  </p>
                </div>
                <p className="text-lg text-black/50">
                  {/* Published at{' '}
              {format(media.createdAt as unknown as Date, 'LLL do yyyy, H:mm')} */}
                  Jan, 1 2004
                </p>
              </div>
            </header>
            <p className=" text-[18px] mb-9">
              {/* {media.body} */}"Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate
              velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
              occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.""Lorem ipsum dolor sit amet,
              consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate
              velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
              occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.""Lorem ipsum dolor sit amet,
              consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate
              velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
              occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.""Lorem ipsum dolor sit amet,
              consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate
              velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
              occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum."
            </p>
            <div className="">
              <Link className="flex gap-2" href={'/media'}>
                <IconArrowLeft /> Буцах
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  };
