import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, UploadCloud } from 'lucide-react';
import { getLogoImageUrl } from '@/lib/cloudinary-url';

interface ConfigTabSettings {
  logoUrl: string;
  mapUrl: string;
  whatsappNumber: string;
  phone: string;
  address: string;
  email: string;
  instagramUrl: string;
  facebookUrl: string;
  heroImageScale: number;
  catalogImageHeight: number;
}

interface ConfigTabProps {
  settings: ConfigTabSettings;
  onSettingsUpdate: (updates: Partial<ConfigTabSettings>) => void;
}

export function ConfigTab({ settings, onSettingsUpdate }: ConfigTabProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [mapInput, setMapInput] = useState(settings.mapUrl || '');
  const [contactInput, setContactInput] = useState({
    whatsappNumber: settings.whatsappNumber || '',
    phone: settings.phone || '',
    address: settings.address || '',
    email: settings.email || '',
    instagramUrl: settings.instagramUrl || '',
    facebookUrl: settings.facebookUrl || '',
  });
  const [imageSizeInput, setImageSizeInput] = useState({
    heroImageScale: (settings.heroImageScale ?? 1.05).toString(),
    catalogImageHeight: (settings.catalogImageHeight ?? 192).toString(),
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setMapInput(settings.mapUrl || '');
    setContactInput({
      whatsappNumber: settings.whatsappNumber || '',
      phone: settings.phone || '',
      address: settings.address || '',
      email: settings.email || '',
      instagramUrl: settings.instagramUrl || '',
      facebookUrl: settings.facebookUrl || '',
    });
    setImageSizeInput({
      heroImageScale: (settings.heroImageScale ?? 1.05).toString(),
      catalogImageHeight: (settings.catalogImageHeight ?? 192).toString(),
    });
  }, [settings]);

  const saveSetting = async (key: string, value: string) => {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });

    if (res.status === 401) {
      window.location.href = '/admin/login';
      return;
    }

    if (!res.ok) {
      throw new Error('Error saving setting');
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('kind', 'logo');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });

      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }

      const data = await res.json();

      if (data.url) {
        await saveSetting('logo_url', data.url);

        onSettingsUpdate({ logoUrl: data.url });
        setSuccessMessage('El logo del sitio se ha cambiado correctamente.');
        setShowSuccessDialog(true);
      }
    } catch (err) {
      console.error(err);
      alert('Error al subir el logo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveMap = async () => {
    try {
      // Extract src if full iframe is pasted
      let finalUrl = mapInput;
      if (mapInput.includes('<iframe')) {
        const srcMatch = mapInput.match(/src="([^"]+)"/);
        finalUrl = srcMatch ? srcMatch[1] : mapInput;
      }

      await saveSetting('map_url', finalUrl);

      onSettingsUpdate({ mapUrl: finalUrl });
      setMapInput(finalUrl); // Update input to show clean URL
      setSuccessMessage('La ubicación del mapa se ha actualizado correctamente.');
      setShowSuccessDialog(true);
    } catch (err) {
      console.error(err);
      alert('Error al guardar el mapa');
    }
  };

  const handleSaveContact = async () => {
    try {
      const updates = {
        whatsappNumber: contactInput.whatsappNumber.trim(),
        phone: contactInput.phone.trim(),
        address: contactInput.address.trim(),
        email: contactInput.email.trim(),
        instagramUrl: contactInput.instagramUrl.trim(),
        facebookUrl: contactInput.facebookUrl.trim(),
      };

      await Promise.all([
        saveSetting('whatsapp_number', updates.whatsappNumber),
        saveSetting('phone', updates.phone),
        saveSetting('address', updates.address),
        saveSetting('email', updates.email),
        saveSetting('instagram_url', updates.instagramUrl),
        saveSetting('facebook_url', updates.facebookUrl),
      ]);

      onSettingsUpdate(updates);
      setSuccessMessage('La información de contacto se ha actualizado correctamente.');
      setShowSuccessDialog(true);
    } catch (err) {
      console.error(err);
      alert('Error al guardar la información de contacto');
    }
  };

  const parseNumberInput = (value: string, fallback: number) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
    return parsed;
  };

  const handleSaveImageSizes = async () => {
    try {
      const heroImageScale = parseNumberInput(
        imageSizeInput.heroImageScale,
        settings.heroImageScale ?? 1.05
      );
      const catalogImageHeight = Math.round(
        parseNumberInput(
          imageSizeInput.catalogImageHeight,
          settings.catalogImageHeight ?? 192
        )
      );

      await Promise.all([
        saveSetting('hero_image_scale', heroImageScale.toString()),
        saveSetting('catalog_image_height', catalogImageHeight.toString()),
      ]);

      onSettingsUpdate({ heroImageScale, catalogImageHeight });
      setImageSizeInput({
        heroImageScale: heroImageScale.toString(),
        catalogImageHeight: catalogImageHeight.toString(),
      });
      setSuccessMessage('Tamaño de imágenes actualizado correctamente.');
      setShowSuccessDialog(true);
    } catch (err) {
      console.error(err);
      alert('Error al guardar el tamaño de imágenes');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {/* Logo Section */}
      <div className="bg-white rounded-lg shadow p-8 space-y-8">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-4">Logo del Sitio</h3>
        <div className="space-y-4">
          <Label className="block text-sm font-medium text-gray-700">Logo Actual</Label>
          <div className="flex items-start gap-6">
            <div className="relative h-24 w-60 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
              <Image
                src={getLogoImageUrl(settings.logoUrl)}
                alt="Logo Preview"
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-xs text-gray-500">
                Subi tu logo en PNG con fondo transparente.
                No se aplica eliminacion de fondo automaticamente.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="logo-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={isUploading}
                />
                <Button asChild variant="outline" disabled={isUploading}>
                  <label htmlFor="logo-upload" className="cursor-pointer flex items-center gap-2">
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UploadCloud className="h-4 w-4" />
                    )}
                    {isUploading ? 'Subiendo...' : 'Subir Nuevo Logo'}
                  </label>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-lg shadow p-8 space-y-6">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-4">Ubicacion (Google Maps)</h3>
        <div className="space-y-4">
          <Label className="block text-sm font-medium text-gray-700">
            URL de Insercion (Embed) de Google Maps
          </Label>
          <p className="text-xs text-gray-500">
            Anda a Google Maps, busca tu local, pone Compartir, Insertar un mapa y copia
            el HTML o solo el link src.
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              className="flex-1"
              placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
              value={mapInput}
              onChange={(e) => setMapInput(e.target.value)}
            />
            <Button onClick={handleSaveMap}>Guardar Mapa</Button>
          </div>
          {settings.mapUrl && (
            <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 aspect-video w-full">
              <iframe
                src={settings.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>
      </div>

      {/* Image Size Section */}
      <div className="bg-white rounded-lg shadow p-8 space-y-6">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-4">Tamanio de imagenes</h3>
        <p className="text-xs text-gray-500">
          Ajusta el tamanio del carrusel principal y del catalogo. El catalogo se adapta
          automaticamente a la altura configurada.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Escala de imagen en hero</Label>
            <Input
              type="number"
              step="0.01"
              value={imageSizeInput.heroImageScale}
              onChange={(e) =>
                setImageSizeInput((prev) => ({ ...prev, heroImageScale: e.target.value }))
              }
              placeholder="1.05"
            />
            <p className="text-xs text-gray-500">Recomendado: 0.8 a 1.4.</p>
          </div>
          <div className="space-y-2">
            <Label>Altura de imagen en catalogo (px)</Label>
            <Input
              type="number"
              step="1"
              value={imageSizeInput.catalogImageHeight}
              onChange={(e) =>
                setImageSizeInput((prev) => ({ ...prev, catalogImageHeight: e.target.value }))
              }
              placeholder="192"
            />
            <p className="text-xs text-gray-500">Recomendado: 140 a 320.</p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSaveImageSizes}>Guardar tamanos</Button>
        </div>
      </div>
      {/* Contact Section */}
      <div className="bg-white rounded-lg shadow p-8 space-y-6">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-4">Contacto y Redes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>WhatsApp</Label>
            <Input
              value={contactInput.whatsappNumber}
              onChange={(e) => setContactInput({ ...contactInput, whatsappNumber: e.target.value })}
              placeholder="5491112345678"
            />
          </div>
          <div className="space-y-2">
            <Label>Teléfono</Label>
            <Input
              value={contactInput.phone}
              onChange={(e) => setContactInput({ ...contactInput, phone: e.target.value })}
              placeholder="+54 9 11 1234-5678"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={contactInput.email}
              onChange={(e) => setContactInput({ ...contactInput, email: e.target.value })}
              placeholder="info@multimarkmotos.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Dirección</Label>
            <Input
              value={contactInput.address}
              onChange={(e) => setContactInput({ ...contactInput, address: e.target.value })}
              placeholder="Av. Ejemplo 1234, Buenos Aires"
            />
          </div>
          <div className="space-y-2">
            <Label>Instagram</Label>
            <Input
              value={contactInput.instagramUrl}
              onChange={(e) => setContactInput({ ...contactInput, instagramUrl: e.target.value })}
              placeholder="https://instagram.com/tu-cuenta"
            />
          </div>
          <div className="space-y-2">
            <Label>Facebook</Label>
            <Input
              value={contactInput.facebookUrl}
              onChange={(e) => setContactInput({ ...contactInput, facebookUrl: e.target.value })}
              placeholder="https://facebook.com/tu-pagina"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSaveContact}>Guardar Contacto</Button>
        </div>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
              ¡Configuración Actualizada!
            </DialogTitle>
            <DialogDescription className="pt-2">
              {successMessage}
              <br />
              Los cambios ya están visibles en el sitio.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowSuccessDialog(false)}>Aceptar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


