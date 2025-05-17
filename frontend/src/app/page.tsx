import { HomeSection } from '@/components/sections/home-section';
import { AboutChatSection } from '@/components/sections/about-chat-section';
import { GhostSection } from '@/components/sections/ghost-section';
import { FaqSection } from '@/components/sections/faq-section';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { MainContainer } from '@/components/ui/main-container';

export default function Home() {
  return (
    <>
      <Header />
      <MainContainer className="space-y-30">
        <HomeSection />
        <AboutChatSection />
        <GhostSection />
        <FaqSection />
      </MainContainer>
      <Footer />
    </>
  );
}
