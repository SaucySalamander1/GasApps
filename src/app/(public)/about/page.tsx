import { PageHeader } from '@/components/sections/PageHeader';
import { CompanyStory } from '@/components/sections/CompanyStory';
import { MissionVision } from '@/components/sections/MissionVision';
import { CoreValues } from '@/components/sections/CoreValues';
import { Leadership } from '@/components/sections/Leadership';
import { Timeline } from '@/components/sections/Timeline';
import { Partners } from '@/components/sections/Partners';

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About GasApps"
        description="Engineering trust into every fitting, one project at a time."
      />
      <CompanyStory />
      <MissionVision />
      <CoreValues />
      <Leadership />
      <Timeline />
      <Partners />
    </>
  );
}
