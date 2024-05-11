// import Sign from '@/bazo/login-next';
// import PublicLayout from '@/components/layout/public-layout';

import PublicLayout from '@/components/layout/public-layout';
import EmailCta from '@/components/sections/home/email-cta';
import PartnersHome from '@/components/sections/home/partners-home';
import VolunteersMap from '@/components/sections/home/volunteers-map';
import MediaSection from '@/components/sections/home/media-section';
import Features from '@/components/sections/home/features';
import UsertypeExplain from '@/components/sections/home/usertype-explain';
import Banner from '@/components/sections/home/banner';
import { api } from '@/utils/api';
import type { Country } from '@/lib/db/types';
import LatestProjects from '@/components/sections/home/latest-projects';

export default function Home() {
  const { data, isLoading } = api.data.getHomeStatistics.useQuery();
  console.log(data);
  return (
    <PublicLayout>
      <Banner
        totalProjects={(data?.totalProjects as number) ?? 0}
        totalVolunteeringEvents={(data?.totalVolunteeringEvents as number) ?? 0}
        volunteersPercentage={(data?.volunteersPercentage as number) ?? 0}
        totalDonations={(data?.totalDonation as number) ?? 0}
        thisMonthProjectsAndEvents={
          (data?.thisMonthProjectsAndEvents as number) ?? 0
        }
        isLoading={isLoading}
      />
      <UsertypeExplain />
      <Features />
      <LatestProjects />
      <MediaSection />
      <VolunteersMap
        level_1={data?.level_1 ?? 0}
        level_2={data?.level_2 ?? 0}
        level_3={data?.level_3 ?? 0}
        level_4={data?.level_4 ?? 0}
        countries={data?.countries as unknown as Country[]}
        isLoading={isLoading}
      />
      <PartnersHome />
      <EmailCta />
    </PublicLayout>
  );
}
