"use client";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import Header from "@/components/client/layout/header";
import Footer from "@/components/client/layout/footer";
import Section1 from "@/components/client/about/section1";
import Section2 from "@/components/client/about/section2";
import Section3 from "@/components/client/about/section3";
import WhyJoin from "@/components/client/about/whyjoin";
import HowItWorks from "@/components/client/about/howItWorks";
import Tutorial from "@/components/client/about/tutorial";
import TraditionalSection from "@/components/client/about/traditionalSection";
import OchardSection from "@/components/client/about/ochardSection";
import TradersRanks from "@/components/client/about/tradersRanks";
import Commission from "@/components/client/about/commission";
import ClientSay from "@/components/client/about/clientSay";
import MoreUserSection from "@/components/client/about/moreUserSection";
import Testimonials from "@/components/client/about/testimonials";
import FAQSection from "@/components/client/about/faqSection";
import ConatctSection from "@/components/client/about/conatctSection";

export default function MainPage() {
  return (
    <>
      <Header />
      <Section1 />
      <Section2 />
      <WhyJoin />
      <HowItWorks />
      <Section3 />
      <Tutorial />
      <TraditionalSection />
      <OchardSection />
      <TradersRanks />
      <Commission />
      <ClientSay />
      <MoreUserSection />
      <Testimonials />
      <FAQSection />
      <ConatctSection />
      <Footer />
    </>
  );
}
