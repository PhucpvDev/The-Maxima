"use client";

import Header from "@/components/client/layout/header";
import Footer from "@/components/client/layout/footer";
import Section1 from "@/components/client/about/section1";
import Section2 from "@/components/client/about/section2";
import Introduction from "@/components/client/about/introduction";
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
import ConatctSection from "@/components/client/about/contactSection";
import Posts from "@/components/client/about/posts";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function MainPage() {
  return (
    <div className="relative">
      <Header />
      <main>
        <Section1 id="home" />
        <Section2 />
        <Introduction id="about" />
        <WhyJoin />
        <HowItWorks id="how" />
        <Section3 />
        <Tutorial id="tutorial" />
        <TraditionalSection />
        <Posts id="posts" />
        <OchardSection />
        <TradersRanks />
        <Commission id="become-ib" />
        <ClientSay />
        <MoreUserSection />
        <Testimonials />
        <FAQSection id="faq" />
        <ConatctSection id="contact" />
      </main>
      <Footer />
    </div>
  );
}
