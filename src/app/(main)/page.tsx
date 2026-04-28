import HeroSection from '@/components/sections/HeroSection';
import FeaturedDistricts from '@/components/sections/FeaturedDistricts';
import LatestAnnouncements from '@/components/sections/LatestAnnouncements';
import UpcomingEvents from '@/components/sections/UpcomingEvents';
import HeritageHighlights from '@/components/sections/HeritageHighlights';
import CommunityStats from '@/components/sections/CommunityStats';
import JoinCTA from '@/components/sections/JoinCTA';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CommunityStats />
      <LatestAnnouncements />
      <FeaturedDistricts />
      <UpcomingEvents />
      <HeritageHighlights />
      <JoinCTA />
    </>
  );
}
