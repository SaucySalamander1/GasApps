import { CompanyOverview } from '@/components/sections/CompanyOverview';
import { EngineeringServices } from '@/components/sections/EngineeringServices';
import { FeaturedProducts } from '@/components/sections/FeaturedProducts';
import { Hero } from '@/components/sections/Hero';
import { IndustriesServed } from '@/components/sections/IndustriesServed';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { Certifications } from '@/components/sections/Certifications';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { Testimonials } from '@/components/sections/Testimonials';
import { Newsletter } from '@/components/sections/Newsletter';
import { LatestNews } from '@/components/sections/LatestNews';
import { ContactCta } from '@/components/sections/ContactCta';
import { PartnerLogos } from '@/components/sections/PartnerLogos';

export default function HomePage() {
  return (
    <>
      <Hero />
      <PartnerLogos />
      <CompanyOverview />
      <FeaturedProducts />
      <EngineeringServices />
      <IndustriesServed />
      <WhyChooseUs />
      <Certifications />
      <FeaturedProjects />
      <Testimonials />
      <LatestNews />
      <Newsletter />
      <ContactCta />
    </>
  );
}
