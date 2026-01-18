'use client';

import { useState, useEffect, useCallback, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Moto } from '@/types';
import { MotoForm } from '@/components/MotoForm';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, LogOut } from 'lucide-react';
import Image from 'next/image';
import { ConfigTab } from '@/components/ConfigTab';

interface DashboardSettings {
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

export default function DashboardPage() {
  const router = useRouter();
  const [motos, setMotos] = useState<Moto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventario' | 'portada' | 'configuracion'>('inventario');
  const [editingMoto, setEditingMoto] = useState<Moto | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Moto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [settings, setSettings] = useState<DashboardSettings>({
    logoUrl: '/images/logo.png',
    mapUrl: '',
    whatsappNumber: '',
    phone: '',
    address: '',
    email: '',
    instagramUrl: '',
    facebookUrl: '',
    heroImageScale: 1.05,
    catalogImageHeight: 192,
  });

  const parseSettingNumber = (value: string | undefined, fallback: number) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const handleUnauthorized = useCallback(() => {
    router.push('/admin/login');
  }, [router]);

  // Cargar motos y configuración
  const fetchInitialData = useCallback(async () => {
    try {
      const [motosRes, settingsRes] = await Promise.all([
        fetch('/api/motos'),
        fetch('/api/settings'),
      ]);

      if (motosRes.status === 401 || settingsRes.status === 401) {
        handleUnauthorized();
        return;
      }

      const motosData = await motosRes.json();
      const settingsData = await settingsRes.json();

      setMotos(motosData);
      setSettings({
        logoUrl: settingsData.logo_url || '/images/logo.png',
        mapUrl: settingsData.map_url || '',
        whatsappNumber: settingsData.whatsapp_number || '',
        phone: settingsData.phone || '',
        address: settingsData.address || '',
        email: settingsData.email || '',
        instagramUrl: settingsData.instagram_url || '',
        facebookUrl: settingsData.facebook_url || '',
        heroImageScale: parseSettingNumber(settingsData.hero_image_scale, 1.05),
        catalogImageHeight: parseSettingNumber(settingsData.catalog_image_height, 192),
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Agregar/Editar moto
  const handleSave = async (moto: Moto) => {
    try {
      const method = moto.id ? 'PUT' : 'POST';
      const res = await fetch('/api/motos', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(moto),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (res.ok) {
        fetchInitialData();
        setIsFormOpen(false);
        setEditingMoto(undefined);
      }
    } catch (error) {
      console.error('Error saving moto:', error);
    }
  };

  // Eliminar moto
  const handleDeleteConfirm = async (event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/motos?id=${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (res.ok) {
        fetchInitialData();
      }
    } catch (error) {
      console.error('Error deleting moto:', error);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/admin/login');
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-8 py-3 flex justify-between items-center">
        <div className="relative h-12 w-40">
          <Image
            src={settings.logoUrl}
            alt="Multimark Motos"
            fill
            className="object-contain object-left"
          />
        </div>
        <Button variant="ghost" className="text-red-500 gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Salir
        </Button>
      </nav>

      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Panel de Control</h2>
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('inventario')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'inventario'
                    ? 'bg-white shadow text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Inventario
              </button>
              <button
                onClick={() => setActiveTab('portada')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'portada'
                    ? 'bg-white shadow text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Portada (Hero)
              </button>
              <button
                onClick={() => setActiveTab('configuracion')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'configuracion'
                    ? 'bg-white shadow text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Configuración
              </button>
            </div>
          </div>
          <Button
            onClick={() => {
              setEditingMoto(undefined);
              setIsFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Moto
          </Button>
        </div>

        {activeTab === 'inventario' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {motos.map((moto) => (
                  <TableRow key={moto.id}>
                    <TableCell>
                      <div className="relative h-12 w-12">
                        <Image
                          src={moto.imagen}
                          alt={moto.nombre}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{moto.marca}</TableCell>
                    <TableCell>{moto.nombre}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {moto.destacada && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                            Destacada
                          </span>
                        )}
                        {moto.show_in_hero && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            Portada
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditingMoto(moto);
                          setIsFormOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDeleteTarget(moto)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {motos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No hay motos cargadas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {activeTab === 'portada' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              Seleccioná las motos que querés que aparezcan en el carrusel principal de la portada.
              El diseño optimizado recomienda entre 1 y 5 motos.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {motos.map((moto) => (
                <div
                  key={moto.id}
                  className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    moto.show_in_hero
                      ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                  onClick={async () => {
                    const updated = { ...moto, show_in_hero: !moto.show_in_hero };
                    await handleSave(updated);
                  }}
                >
                  {moto.show_in_hero && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="relative h-32 w-full mb-4">
                    <Image
                      src={moto.imagen}
                      alt={moto.nombre}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-bold text-lg">
                    {moto.marca} {moto.nombre}
                  </h3>
                  <p className="text-sm text-gray-500 uppercase">{moto.tipo}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'configuracion' && (
          <ConfigTab
            settings={settings}
            onSettingsUpdate={(updates) =>
              setSettings((prev) => ({ ...prev, ...updates }))
            }
          />
        )}
      </main>

      <MotoForm
        moto={editingMoto}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeleteTarget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar moto</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará{' '}
              <span className="font-semibold text-foreground">
                {deleteTarget ? `${deleteTarget.marca} ${deleteTarget.nombre}` : 'esta moto'}
              </span>{' '}
              del catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
