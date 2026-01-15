'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Moto } from '@/types';
import { MotoForm } from '@/components/MotoForm';
import { Button } from '@/components/ui/button';
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

export default function DashboardPage() {
  const router = useRouter();
  const [motos, setMotos] = useState<Moto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMoto, setEditingMoto] = useState<Moto | undefined>(undefined);

  // Cargar motos
  const fetchMotos = async () => {
    try {
      const res = await fetch('/api/motos');
      const data = await res.json();
      setMotos(data);
    } catch (error) {
      console.error('Error fetching motos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMotos();
  }, []);

  // Agregar/Editar moto
  const handleSave = async (moto: Moto) => {
    try {
      const method = editingMoto ? 'PUT' : 'POST';
      const res = await fetch('/api/motos', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(moto),
      });

      if (res.ok) {
        fetchMotos();
        setIsFormOpen(false);
        setEditingMoto(undefined);
      }
    } catch (error) {
      console.error('Error saving moto:', error);
    }
  };

  // Eliminar moto
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que querés eliminar esta moto?')) return;

    try {
      const res = await fetch(`/api/motos?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchMotos();
      }
    } catch (error) {
      console.error('Error deleting moto:', error);
    }
  };

  const handleLogout = () => {
    // Limpiar cookie (mock)
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/admin/login');
  };

  if (isLoading) return <div className="p-8 text-center">Cargando panel...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-8 py-3 flex justify-between items-center">
        <div className="relative h-12 w-40">
          <Image
            src="/images/logo.png"
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
          <h2 className="text-2xl font-bold text-gray-800">Inventario de Motos</h2>
          <Button onClick={() => { setEditingMoto(undefined); setIsFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Moto
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagen</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Tipo</TableHead>
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
                  <TableCell className="uppercase text-xs">{moto.tipo}</TableCell>
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
                      onClick={() => handleDelete(moto.id)}
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
      </main>

      <MotoForm
        moto={editingMoto}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
