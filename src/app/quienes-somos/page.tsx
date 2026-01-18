import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { CheckCircle, Users, Award, Heart } from 'lucide-react';
import { LocationMap } from '@/components/LocationMap';
import { ScrollReveal } from '@/components/ScrollReveal';
import { getPublicSettings } from '@/lib/settings';

export default async function QuienesSomos() {
  const valores = [
    {
      icon: CheckCircle,
      title: 'Compromiso',
      description: 'Nos comprometemos con cada cliente para que encuentre la moto perfecta.',
    },
    {
      icon: Users,
      title: 'Atención Personalizada',
      description: 'Cada cliente es único. Te asesoramos según tus necesidades.',
    },
    {
      icon: Award,
      title: 'Calidad Garantizada',
      description: 'Trabajamos solo con las mejores marcas del mercado.',
    },
    {
      icon: Heart,
      title: 'Pasión',
      description: 'Amamos lo que hacemos y eso se refleja en nuestro servicio.',
    },
  ];

  const settings = await getPublicSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <Header logoUrl={settings.logoUrl} />

      <main className="flex-1">
        <ScrollReveal />
        {/* Hero */}
        <section className="relative py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-bebas text-5xl md:text-6xl text-white uppercase mb-4">
              Quiénes <span className="text-primary">Somos</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Más que un concesionario, somos tu socio en el camino hacia la libertad sobre ruedas.
            </p>
          </div>
        </section>

        {/* Historia */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-bebas text-4xl uppercase mb-6">
                Nuestra <span className="text-primary">Historia</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                En <strong>Multimark Motos</strong> nacimos con un objetivo claro: hacer que
                cada persona pueda acceder a su moto ideal. Entendemos que una moto no es
                solo un medio de transporte, es libertad, es pasión, es un sueño.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Por eso trabajamos con las mejores marcas del mercado: <strong>Honda</strong>,{' '}
                <strong>Motomel</strong>, <strong>Zanella</strong>, <strong>Corven</strong>,{' '}
                <strong>Keller</strong> y <strong>Guerrero</strong>. Cada una con su identidad
                y propuesta, para que encuentres exactamente lo que buscás.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Y lo mejor: <strong className="text-primary">100% financiada</strong>. Porque
                creemos que todos merecen cumplir su sueño sobre ruedas.
              </p>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="font-bebas text-4xl uppercase text-center mb-12">
              Nuestros <span className="text-primary">Valores</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {valores.map((valor, index) => (
                <div
                  key={index}
                  data-reveal
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center reveal"
                  style={{
                    '--reveal-delay': `${index * 90}ms`,
                  } as CSSProperties}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 text-primary rounded-full mb-4">
                    <valor.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-bebas text-xl uppercase mb-2">{valor.title}</h3>
                  <p className="text-gray-600 text-sm">{valor.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-bebas text-4xl text-white uppercase mb-4">
              ¿Listo para encontrar tu moto?
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Visitá nuestro local o contactanos por WhatsApp. Estamos para ayudarte a elegir
              la moto perfecta para vos.
            </p>
            <Link
              href="/#catalogo"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary font-semibold uppercase tracking-wider rounded-lg hover:bg-gray-100 transition-colors"
            >
              Ver Catálogo
            </Link>
          </div>
        </section>

        <LocationMap mapUrl={settings.mapUrl} />
      </main>

      <Footer
        logoUrl={settings.logoUrl}
        phone={settings.phone}
        email={settings.email}
        address={settings.address}
        instagramUrl={settings.instagramUrl}
        facebookUrl={settings.facebookUrl}
      />
      <WhatsAppButton whatsappNumber={settings.whatsappNumber} />
    </div>
  );
}
