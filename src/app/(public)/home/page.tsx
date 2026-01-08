import HomeHeader from "@/components/common/HomeHeader";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import PopularServicesSection from "@/components/home/PopularServicesSection";
import WhyUseOurPlatformSection from "@/components/home/WhyUseOurPlatformSection";
import WhatCustomersSaySection, { Testimonial } from "@/components/home/WhatCustomersSaySection";
import BecomeAProfessionalBannerSection from "@/components/home/BecomeAProfessionalBannerSection";
import FAQSection from "@/components/home/FAQSection";
import InspirationSection from "@/components/home/InspirationSection";
import HomeFooter from "@/components/common/HomeFooter";
import { fetchBusinessReviewsData, fetchFaqsData, fetchHowItWorksData, fetchInspirationData } from "@/lib/api/HomePageApi";
import { BusinessReviewItem, FAQItem, HomePageItem } from "@/types/homePage";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [howItWorksResp, inspirationResp, faqsResp, businessReviewsResp] = await Promise.all([
    fetchHowItWorksData(),
    fetchInspirationData(),
    fetchFaqsData(),
    fetchBusinessReviewsData(),
  ]);

  const howItWorksItems: HomePageItem[] =
    howItWorksResp.success && howItWorksResp.data ? howItWorksResp.data?.items : [];

  const inspirationItems: HomePageItem[] =
    inspirationResp.success && inspirationResp.data ? inspirationResp.data?.items : [];
  const faqsItems: FAQItem[] = faqsResp.data!.items;

  const testimonials: Testimonial[] = businessReviewsResp.data!.items?.map(
    (review: BusinessReviewItem) => ({
      rating: review.rating,
      text: review.review_text,
      name: review.customer.full_name,
      date: new Date(review.createdAt).toLocaleDateString("no-NO"),
      imageUrl: review.customer.profile_image ?? "",
    })
  );

  return (
    <div>
      <HomeHeader />
      <HeroSection />
      <HowItWorksSection items={howItWorksItems} />
      <PopularServicesSection />
      <WhyUseOurPlatformSection />
      <WhatCustomersSaySection testimonials={testimonials} />
      <BecomeAProfessionalBannerSection />
      <FAQSection faqs={faqsItems} />
      <InspirationSection items={inspirationItems} />
      <HomeFooter />
    </div>
  );
}
