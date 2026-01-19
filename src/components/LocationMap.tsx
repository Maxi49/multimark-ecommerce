interface LocationMapProps {
  mapUrl?: string;
}

export function LocationMap({ mapUrl }: LocationMapProps) {
  if (!mapUrl) return null;

  return (
    <section className="py-16 bg-white reveal" data-reveal>
      <div className="container mx-auto px-4">
        <h2 className="font-bebas text-4xl uppercase text-center mb-8">
          Nuestra <span className="text-primary">Ubicación</span>
        </h2>

        <div className="max-w-5xl mx-auto h-112.5 w-full bg-gray-100 rounded-xl overflow-hidden shadow-lg border border-gray-200">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full transition-all duration-500"
          />
        </div>
        <div className="text-center mt-6 text-gray-600">
          <p className="flex items-center justify-center gap-2">
            Visitá nuestro local para ver los modelos en persona.
          </p>
        </div>
      </div>
    </section>
  );
}
