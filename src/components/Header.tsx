'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MARCAS } from '@/types';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/#catalogo', label: 'Catálogo' },
    { href: '/quienes-somos', label: 'Quiénes Somos' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-16 w-52">
            <Image
              src="/images/logo.png"
              alt="Multimark Motos"
              fill
              className="object-contain"
              priority
            />
          </div>
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

        {/* Search and Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Search Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar motos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </form>

          {/* Search Mobile Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-gray-700 hover:text-primary transition-colors uppercase"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-semibold text-gray-500 mb-2">MARCAS</p>
                  {MARCAS.map((marca) => (
                    <Link
                      key={marca.id}
                      href={`/#${marca.id}`}
                      className="block py-2 text-gray-700 hover:text-primary"
                    >
                      {marca.nombre}
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden border-t p-4">
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
      )}
    </header>
  );
}
