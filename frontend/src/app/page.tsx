import { HomeSection } from '@/components/sections/home-section';
import { ThemeButton } from '@/components/theme-button';
import { AboutChatSection } from '@/components/sections/about-chat-section';

export default function Home() {
  return (
    <main className="p-5 sm:p-10">
      <HomeSection />
      <AboutChatSection />
      <ThemeButton />
    </main>
  );
}
