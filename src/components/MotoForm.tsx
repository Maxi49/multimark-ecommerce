'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Moto, MARCAS } from '@/types';
import { ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MotoFormProps {
  moto?: Moto;
  onSave: (moto: Moto) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Opciones predefinidas para facilitar la carga
const SPEC_OPTIONS = {
  cilindrada: ['110cc', '125cc', '150cc', '200cc', '250cc', '300cc', '400cc', '650cc'],
  motor: ['4 Tiempos', 'Monocilíndrico', 'Bicilíndrico', '4 Tiempos, Monocilíndrico OHC'],
  frenos: ['Tambor', 'Disco', 'Disco/Tambor', 'Disco/Disco', 'ABS'],
  arranque: ['Eléctrico', 'Patada', 'Eléctrico/Patada'],
  capacidadTanque: ['3.5L', '4L', '5L', '6L', '9L', '12L', '15L'],
};

const REQUIRED_SPEC_FIELDS: { key: keyof Moto['specs']; label: string }[] = [
  { key: 'cilindrada', label: 'Cilindrada' },
  { key: 'motor', label: 'Motor' },
  { key: 'frenos', label: 'Frenos' },
  { key: 'arranque', label: 'Arranque' },
  { key: 'capacidadTanque', label: 'Capacidad tanque' },
];

const hasText = (value?: string) => typeof value === 'string' && value.trim().length > 0;

interface SpecInputProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  options: string[];
}

function SpecInput({ label, value, onChange, options }: SpecInputProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Escribir ${label.toLowerCase()}...`}
          className="flex-1"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <ChevronDown className="h-4 w-4 opacity-50" />
              <span className="sr-only">Opciones</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {options.map((opt) => (
              <DropdownMenuItem key={opt} onClick={() => onChange(opt)}>
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function MotoForm({ moto, onSave, isOpen, onClose }: MotoFormProps) {
  const [formData, setFormData] = useState<Partial<Moto>>({
    nombre: '',
    marca: 'Honda',
    tipo: 'urbana',
    imagen: '',
    cloudinary_public_id: '',
    destacada: false,
    show_in_hero: false,
    specs: {
      cilindrada: '',
      motor: '',
      frenos: '',
      arranque: '',
      capacidadTanque: '',
    },
  });
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (moto) {
      setFormData(moto);
    } else {
      setFormData({
        nombre: '',
        marca: 'Honda',
        tipo: 'urbana',
        imagen: '',
        cloudinary_public_id: '',
        destacada: false,
        show_in_hero: false,
        specs: {
          cilindrada: '',
          motor: '',
          frenos: '',
          arranque: '',
          capacidadTanque: '',
        },
      });
    }
    setFormError('');
  }, [moto, isOpen]);

  const getMissingFields = () => {
    const missing: string[] = [];
    if (!hasText(formData.marca)) missing.push('Marca');
    if (!hasText(formData.nombre)) missing.push('Nombre');
    if (!hasText(formData.tipo)) missing.push('Tipo');
    if (!hasText(formData.imagen)) missing.push('Imagen');

    REQUIRED_SPEC_FIELDS.forEach(({ key, label }) => {
      if (!hasText(formData.specs?.[key])) {
        missing.push(label);
      }
    });

    return missing;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const missingFields = getMissingFields();
    if (missingFields.length > 0) {
      setFormError(`Completa los campos obligatorios: ${missingFields.join(', ')}.`);
      return;
    }

    onSave(formData as Moto);
  };

  const handleSpecChange = (field: keyof Moto['specs'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      specs: { ...prev.specs!, [field]: value },
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{moto ? 'Editar Moto' : 'Agregar Nueva Moto'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Marca</Label>
              <Select
                value={formData.marca}
                onValueChange={(value) => setFormData({ ...formData, marca: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar marca" />
                </SelectTrigger>
                <SelectContent>
                  {MARCAS.map((marca) => (
                    <SelectItem key={marca.id} value={marca.nombre}>
                      {marca.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nombre Modelo</Label>
              <Input
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: Moto['tipo']) => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urbana">Urbana</SelectItem>
                  <SelectItem value="street">Street</SelectItem>
                  <SelectItem value="enduro">Enduro</SelectItem>
                  <SelectItem value="scooter">Scooter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Imagen</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setIsUploading(true);
                    try {
                      const uploadData = new FormData();
                      uploadData.append('file', file);
                      uploadData.append('kind', 'moto');

                      const res = await fetch('/api/upload', {
                        method: 'POST',
                        body: uploadData,
                      });

                      const data = await res.json();
                      if (data.url) {
                        setFormData((prev) => ({
                          ...prev,
                          imagen: data.url,
                          cloudinary_public_id: data.publicId || '',
                        }));
                        setFormError('');
                      }
                    } catch (error) {
                      console.error('Upload failed:', error);
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                  disabled={isUploading}
                />
                {isUploading && (
                  <span className="text-sm text-blue-600 animate-pulse">Subiendo...</span>
                )}
              </div>
              {formData.imagen && (
                <p className="text-xs text-gray-500">Imagen cargada correctamente.</p>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="mb-4 text-sm font-semibold uppercase text-gray-500">
              Especificaciones
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SpecInput
                label="Cilindrada"
                value={formData.specs?.cilindrada}
                onChange={(val) => handleSpecChange('cilindrada', val)}
                options={SPEC_OPTIONS.cilindrada}
              />
              <SpecInput
                label="Motor"
                value={formData.specs?.motor}
                onChange={(val) => handleSpecChange('motor', val)}
                options={SPEC_OPTIONS.motor}
              />
              <SpecInput
                label="Frenos"
                value={formData.specs?.frenos}
                onChange={(val) => handleSpecChange('frenos', val)}
                options={SPEC_OPTIONS.frenos}
              />
              <SpecInput
                label="Arranque"
                value={formData.specs?.arranque}
                onChange={(val) => handleSpecChange('arranque', val)}
                options={SPEC_OPTIONS.arranque}
              />
              <SpecInput
                label="Capacidad Tanque"
                value={formData.specs?.capacidadTanque}
                onChange={(val) => handleSpecChange('capacidadTanque', val)}
                options={SPEC_OPTIONS.capacidadTanque}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="destacada"
                checked={formData.destacada}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, destacada: checked as boolean })
                }
              />
              <Label htmlFor="destacada">Destacada en inicio (Carrusel)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="show_in_hero"
                checked={formData.show_in_hero}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, show_in_hero: checked as boolean })
                }
              />
              <Label htmlFor="show_in_hero" className="font-bold text-blue-600">
                Mostrar en Portada Principal (Hero)
              </Label>
            </div>
          </div>

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? 'Procesando imagen...' : 'Guardar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
