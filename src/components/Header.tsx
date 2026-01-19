'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { Home, LayoutGrid, Search, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MARCAS } from '@/types';
import { getLogoImageUrl } from '@/lib/cloudinary-url';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onSearch?: (query: string) => void;
  logoUrl?: string;
  initialQuery?: string;
}

export function Header({ onSearch, logoUrl, initialQuery }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery ?? '');
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoSrc = getLogoImageUrl(logoUrl || '/images/logo.png');

  const runSearch = useCallback(
    (query: string) => {
      const normalizedQuery = query.trim();

      if (onSearch) {
        onSearch(normalizedQuery);
        return;
      }

      if (!normalizedQuery) {
        return;
      }

      router.push(`/?q=${encodeURIComponent(normalizedQuery)}`);
    },
    [onSearch, router]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      runSearch(searchQuery);
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchQuery, runSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(searchQuery);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/#catalogo', label: 'Catálogo' },
    { href: '/quienes-somos', label: 'Quiénes Somos' },
  ];

  const mobileLinks = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/#catalogo', label: 'Catálogo', icon: LayoutGrid },
    { href: '/quienes-somos', label: 'Conocenos', icon: Users },
  ];

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b border-gray-100 bg-white transition-shadow duration-300',
          isScrolled ? 'shadow-lg shadow-black/5' : 'shadow-none'
        )}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logoSrc}
              alt="Multimark Motos"
              width={208}
              height={64}
              className="h-16 w-52 object-contain"
              sizes="208px"
              quality={95}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors uppercase tracking-wide"
              >
                {link.label}
              </Link>
            ))}

            {/* Dropdown de Marcas */}
            <div className="relative group">
              <button className="text-sm font-medium text-gray-700 hover:text-primary transition-colors uppercase tracking-wide">
                Marcas
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {MARCAS.map((marca) => (
                    <Link
                      key={marca.id}
                      href={`/#${marca.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                    >
                      {marca.nombre}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

        </div>
      </header>

      <div className="w-full border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4 py-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar motos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </form>
        </div>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/90">
        <div className="mx-auto flex max-w-sm items-center justify-between px-6 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          {mobileLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-1 text-[11px] font-semibold text-gray-600 transition-colors hover:text-primary"
            >
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
