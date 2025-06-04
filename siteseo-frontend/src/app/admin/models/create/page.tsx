"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { useModelsStore } from "@/store/models";
import { modelsApi } from "@/lib/api";
import { ArrowLeft, Upload, X } from "lucide-react";

const modelSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  description: z.string().min(10, "Описание должно содержать минимум 10 символов"),
  price_per_hour: z.string().optional(),
  price_per_foo: z.string().optional(),
  price_per_night: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  boobs: z.string().optional(),
  place: z.string().min(2, "Укажите город"),
  number: z.string().optional(),
});

type ModelFormData = z.infer<typeof modelSchema>;

export default function CreateModelPage() {
  const { user } = useAuthStore();
  const { services, fetchServices } = useModelsStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ModelFormData>({
    resolver: zodResolver(modelSchema),
  });

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push("/");
      return;
    }
    fetchServices();
  }, [user, router, fetchServices]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const toggleService = (serviceId: number) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const onSubmit = async (data: ModelFormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Добавляем основные поля
      for (const [key, value] of Object.entries(data)) {
        if (value) {
          formData.append(key, value);
        }
      }

      // Генерируем slug из имени
      const slug = data.name.toLowerCase()
        .replace(/[а-я]/g, (char) => {
          const map: { [key: string]: string } = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
            'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
            'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
            'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
            'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
          };
          return map[char] || char;
        })
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');

      formData.append('slug', slug);

      // Добавляем услуги
      for (const serviceId of selectedServices) {
        formData.append('services', serviceId.toString());
      }

      // Добавляем файл
      if (selectedFile) {
        formData.append('photo', selectedFile);
      }

      await modelsApi.create(formData);

      // Показываем уведомление об успехе (можно добавить toast)
      alert("Модель успешно создана!");

      // Переходим обратно в админ-панель
      router.push("/admin");

    } catch (error) {
      console.error("Ошибка при создании модели:", error);
      alert("Произошла ошибка при создании модели. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
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

            <h1 className="text-3xl font-bold mb-2">Добавить новую модель</h1>
            <p className="text-muted-foreground">
              Заполните форму для создания профиля новой модели
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Основная информация */}
              <Card>
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
                  <CardDescription>
                    Базовые данные о модели
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Имя *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Введите имя модели"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Описание *</Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      placeholder="Подробное описание модели, образование, интересы..."
                      rows={4}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="place">Город *</Label>
                    <Input
                      id="place"
                      {...register("place")}
                      placeholder="Москва, Санкт-Петербург..."
                    />
                    {errors.place && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.place.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="number">Номер телефона</Label>
                    <Input
                      id="number"
                      {...register("number")}
                      placeholder="+7 (xxx) xxx-xx-xx"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Физические параметры */}
              <Card>
                <CardHeader>
                  <CardTitle>Физические параметры</CardTitle>
                  <CardDescription>
                    Параметры внешности
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="height">Рост (см)</Label>
                      <Input
                        id="height"
                        {...register("height")}
                        placeholder="170"
                        type="number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="weight">Вес (кг)</Label>
                      <Input
                        id="weight"
                        {...register("weight")}
                        placeholder="55"
                        type="number"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="boobs">Размер груди</Label>
                    <Input
                      id="boobs"
                      {...register("boobs")}
                      placeholder="2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Ценообразование */}
              <Card>
                <CardHeader>
                  <CardTitle>Ценообразование</CardTitle>
                  <CardDescription>
                    Стоимость услуг в рублях
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="price_per_hour">Цена за час</Label>
                    <Input
                      id="price_per_hour"
                      {...register("price_per_hour")}
                      placeholder="15000"
                      type="number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="price_per_foo">Цена за встречу</Label>
                    <Input
                      id="price_per_foo"
                      {...register("price_per_foo")}
                      placeholder="25000"
                      type="number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="price_per_night">Цена за ночь</Label>
                    <Input
                      id="price_per_night"
                      {...register("price_per_night")}
                      placeholder="80000"
                      type="number"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Услуги и фото */}
              <Card>
                <CardHeader>
                  <CardTitle>Услуги и фото</CardTitle>
                  <CardDescription>
                    Выберите доступные услуги и загрузите фото
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Услуги */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Доступные услуги
                    </Label>
                    <div className="grid grid-cols-1 gap-2">
                      {services.map((service) => (
                        <label
                          key={service.id}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service.id)}
                            onChange={() => toggleService(service.id)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{service.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Загрузка фото */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Фото профиля
                    </Label>

                    {!previewUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <div className="text-sm text-gray-600 mb-2">
                          Нажмите для выбора фото или перетащите файл
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="photo-upload"
                        />
                        <Label
                          htmlFor="photo-upload"
                          className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                        >
                          Выберите файл
                        </Label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Предварительный просмотр"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeFile}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Кнопки действий */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Отменить
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Создание..." : "Создать модель"}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
