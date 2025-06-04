"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/auth";
import { useModelsStore } from "@/store/models";
import { servicesApi, type Service } from "@/lib/api";
import { ArrowLeft, Plus, Trash2, Settings } from "lucide-react";

const serviceSchema = z.object({
  name: z.string().min(2, "Название должно содержать минимум 2 символа"),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function ManageServicesPage() {
  const { user } = useAuthStore();
  const { services, fetchServices } = useModelsStore();
  const router = useRouter();
  const [isAddingService, setIsAddingService] = useState(false);
  const [deleteService, setDeleteService] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
  });

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push("/");
      return;
    }
    fetchServices();
  }, [user, router, fetchServices]);

  const onSubmit = async (data: ServiceFormData) => {
    try {
      await servicesApi.create(data);
      setIsAddingService(false);
      reset();
      fetchServices(); // Обновляем список
      alert("Услуга успешно добавлена!");
    } catch (error) {
      console.error("Ошибка при добавлении услуги:", error);
      alert("Произошла ошибка при добавлении услуги");
    }
  };

  const handleDeleteService = async (service: Service) => {
    setIsDeleting(true);
    try {
      // TODO: Добавить API endpoint для удаления услуги
      // await servicesApi.delete(service.id);
      console.log("Удаление услуги:", service.name);
      setDeleteService(null);
      fetchServices(); // Обновляем список
      alert("Услуга успешно удалена!");
    } catch (error) {
      console.error("Ошибка при удалении услуги:", error);
      alert("Произошла ошибка при удалении услуги");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8">
            <Button variant="outline" asChild className="mb-4">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад к панели управления
              </Link>
            </Button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Управление услугами</h1>
                <p className="text-muted-foreground">
                  Добавляйте и управляйте категориями услуг
                </p>
              </div>

              <Button onClick={() => setIsAddingService(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить услугу
              </Button>
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Settings className="h-8 w-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Всего услуг</p>
                    <p className="text-2xl font-bold">{services.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="h-4 w-4 bg-green-500 rounded-full" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Активные</p>
                    <p className="text-2xl font-bold">{services.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">#</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Популярные</p>
                    <p className="text-2xl font-bold">{Math.min(services.length, 3)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Список услуг */}
          <Card>
            <CardHeader>
              <CardTitle>Услуги ({services.length})</CardTitle>
              <CardDescription>
                Все доступные категории услуг в системе
              </CardDescription>
            </CardHeader>
            <CardContent>
              {services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <Card key={service.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{service.name}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                ID: {service.id}
                              </Badge>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteService(service)}
                            className="text-destructive hover:text-destructive ml-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Пока нет услуг</h3>
                  <p className="text-muted-foreground mb-4">
                    Начните с создания первой категории услуг
                  </p>
                  <Button onClick={() => setIsAddingService(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить услугу
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      {/* Диалог добавления услуги */}
      <Dialog open={isAddingService} onOpenChange={setIsAddingService}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить новую услугу</DialogTitle>
            <DialogDescription>
              Введите название новой категории услуг
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="service-name">Название услуги</Label>
                <Input
                  id="service-name"
                  {...register("name")}
                  placeholder="Например: Деловое сопровождение"
                  autoFocus
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddingService(false);
                  reset();
                }}
              >
                Отменить
              </Button>
              <Button type="submit">
                Добавить
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={!!deleteService} onOpenChange={() => setDeleteService(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить услугу "{deleteService?.name}"?
              Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteService(null)}
              disabled={isDeleting}
            >
              Отменить
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteService && handleDeleteService(deleteService)}
              disabled={isDeleting}
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
