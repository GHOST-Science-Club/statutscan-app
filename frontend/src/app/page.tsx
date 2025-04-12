import { HomeSection } from '@/components/sections/home-section';
import { AboutChatSection } from '@/components/sections/about-chat-section';
import { GhostSection } from '@/components/sections/ghost-section';
import { FaqSection } from '@/components/sections/faq-section';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

export default function Home() {
  return (
    <>
      <Header />
      <main className="space-y-30 p-5">
        <HomeSection />
        <AboutChatSection />
        <GhostSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
