'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Moto, MARCAS } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface MotoFormProps {
  moto?: Moto;
  onSave: (moto: Moto) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function MotoForm({ moto, onSave, isOpen, onClose }: MotoFormProps) {
  const [formData, setFormData] = useState<Partial<Moto>>({
    nombre: '',
    marca: 'Honda',
    tipo: 'urbana',
    imagen: '/images/logo.png', // Default
    destacada: false,
    specs: {
      cilindrada: '',
      motor: '',
      frenos: '',
      arranque: '',
      capacidadTanque: '',
    },
  });

  useEffect(() => {
    if (moto) {
      setFormData(moto);
    } else {
      setFormData({
        nombre: '',
        marca: 'Honda',
        tipo: 'urbana',
        imagen: '/images/logo.png',
        destacada: false,
        specs: {
          cilindrada: '',
          motor: '',
          frenos: '',
          arranque: '',
          capacidadTanque: '',
        },
      });
    }
  }, [moto, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
                onValueChange={(value: any) => setFormData({ ...formData, tipo: value })}
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
              <Label>URL Imagen</Label>
              <Input
                value={formData.imagen}
                onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="mb-4 text-sm font-semibold uppercase text-gray-500">
              Especificaciones
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cilindrada</Label>
                <Input
                  value={formData.specs?.cilindrada}
                  onChange={(e) => handleSpecChange('cilindrada', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Motor</Label>
                <Input
                  value={formData.specs?.motor}
                  onChange={(e) => handleSpecChange('motor', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Frenos</Label>
                <Input
                  value={formData.specs?.frenos}
                  onChange={(e) => handleSpecChange('frenos', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Arranque</Label>
                <Input
                  value={formData.specs?.arranque}
                  onChange={(e) => handleSpecChange('arranque', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Capacidad Tanque</Label>
                <Input
                  value={formData.specs?.capacidadTanque}
                  onChange={(e) =>
                    handleSpecChange('capacidadTanque', e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="destacada"
              checked={formData.destacada}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, destacada: checked as boolean })
              }
            />
            <Label htmlFor="destacada">Destacada en inicio</Label>
          </div>

          <Button type="submit" className="w-full">
            Guardar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
