'use client';

import Link from 'next/link';
import { NAV_ITEMS } from '@/lib/data';
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarButton,
  NavbarLogo,
  NavBody,
  NavItems,
} from '@/components/ui/resizable-navbar';
import { useEffect, useState } from 'react';
import { isLogged } from '@/lib/auth/isLogged';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logged, setIsLogged] = useState(false);

  useEffect(() => {
    isLogged().then(res => setIsLogged(res));
  }, []);

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={NAV_ITEMS} />
        {logged ? (
          <NavbarButton variant="gradient" href="/chat">
            Czat
          </NavbarButton>
        ) : (
          <NavbarButton variant="gradient" href="/login">
            Zaloguj się
          </NavbarButton>
        )}
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {NAV_ITEMS.map((item, idx) => (
            <Link
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {logged ? (
            <NavbarButton variant="gradient" className="w-full" href="/chat">
              Czat
            </NavbarButton>
          ) : (
            <NavbarButton variant="gradient" className="w-full" href="/login">
              Zaloguj się
            </NavbarButton>
          )}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
export { Header };
