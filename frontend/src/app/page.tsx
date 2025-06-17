import { HomeSection } from '@/components/sections/home-section';
import { AboutProjectSection } from '@/components/sections/about-project-section';
import { GhostSection } from '@/components/sections/ghost-section';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { MainContainer } from '@/components/ui/main-container';

export default function Home() {
  return (
    <>
      <Header />
      <MainContainer className="space-y-30">
        <HomeSection />
        <AboutProjectSection />
        <GhostSection />
      </MainContainer>
      <Footer />
    </>
  );
}
