import { HomeSection } from '@/components/sections/home-section';
import { ThemeButton } from '@/components/theme-button';
import { AboutChatSection } from '@/components/sections/about-chat-section';
import { GhostSection } from '@/components/sections/ghost-section';

export default function Home() {
  return (
    <main className="p-5">
      <HomeSection />
      <AboutChatSection />
      <GhostSection />
      <ThemeButton />
    </main>
  );
}
