import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Phone, MapPin, Mail } from 'lucide-react';
import { MARCAS } from '@/types';

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="relative h-16 w-48 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <Image
                src="/images/logo.png"
                alt="Multimark Motos"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-gray-400 text-sm">
              Tu concesionario de confianza. Motos 100% financiadas para que puedas
              cumplir tu sueño sobre ruedas.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Marcas */}
          <div>
            <h3 className="font-bebas text-xl mb-4 uppercase tracking-wider">
              Marcas
            </h3>
            <ul className="space-y-2">
              {MARCAS.map((marca) => (
                <li key={marca.id}>
                  <Link
                    href={`/#${marca.id}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {marca.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bebas text-xl mb-4 uppercase tracking-wider">
              Enlaces
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/#catalogo"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  href="/quienes-somos"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Administración
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-bebas text-xl mb-4 uppercase tracking-wider">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>+54 9 11 1234-5678</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@multimarkmotos.com</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>Av. Ejemplo 1234, Buenos Aires, Argentina</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Multimark Motos. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
