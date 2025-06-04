"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useModelsStore } from "@/store/models";
import { ArrowLeft, Phone, MapPin, Clock, Heart } from "lucide-react";

export default function ModelDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { currentModel, isLoading, fetchModelBySlug } = useModelsStore();

  useEffect(() => {
    if (slug) {
      fetchModelBySlug(slug);
    }
  }, [slug, fetchModelBySlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-[3/4] bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={`loading-skeleton-${i}`} className="h-4 bg-muted rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentModel) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Модель не найдена</h1>
            <p className="text-muted-foreground mb-8">
              Запрашиваемая модель не существует или была удалена.
            </p>
            <Button asChild>
              <Link href="/">Вернуться к каталогу</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          {/* Breadcrumbs */}
          <nav className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад к каталогу
              </Link>
            </Button>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Model Photo */}
            <div className="relative">
              <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                <Image
                  src={currentModel.photo_url || "/placeholder-model.jpg"}
                  alt={`Фото ${currentModel.name} - элитное эскорт сопровождение`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>

            {/* Model Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{currentModel.name}</h1>
                {currentModel.place && (
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    {currentModel.place}
                  </div>
                )}
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>О модели</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentModel.description}
                  </p>
                </CardContent>
              </Card>

              {/* Physical Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Параметры</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {currentModel.height && (
                      <div>
                        <span className="text-sm text-muted-foreground">Рост</span>
                        <p className="font-medium">{currentModel.height}</p>
                      </div>
                    )}
                    {currentModel.weight && (
                      <div>
                        <span className="text-sm text-muted-foreground">Вес</span>
                        <p className="font-medium">{currentModel.weight}</p>
                      </div>
                    )}
                    {currentModel.boobs && (
                      <div>
                        <span className="text-sm text-muted-foreground">Размер</span>
                        <p className="font-medium">{currentModel.boobs}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Prices */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Тарифы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentModel.price_per_hour && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Час</span>
                        <span className="font-semibold text-lg">{currentModel.price_per_hour}</span>
                      </div>
                    )}
                    {currentModel.price_per_foo && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Услуга</span>
                        <span className="font-semibold text-lg">{currentModel.price_per_foo}</span>
                      </div>
                    )}
                    {currentModel.price_per_night && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Ночь</span>
                        <span className="font-semibold text-lg">{currentModel.price_per_night}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              {currentModel.services.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Услуги</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {currentModel.services.map((service) => (
                        <Badge key={service.id} variant="secondary">
                          {service.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact Info */}
              {currentModel.number && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Phone className="h-5 w-5 mr-2" />
                      Контакты
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-medium">{currentModel.number}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Доступна для связи 24/7. Конфиденциальность гарантирована.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button size="lg" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Связаться сейчас
                </Button>
                <Button size="lg" variant="outline" className="w-full">
                  <Heart className="h-4 w-4 mr-2" />
                  Добавить в избранное
                </Button>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16">
            <Card>
              <CardHeader>
                <CardTitle>Важная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Правила встреч</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Предварительная запись обязательна</li>
                    <li>• Минимальная продолжительность встречи - 1 час</li>
                    <li>• Оплата наличными при встрече</li>
                    <li>• Взаимное уважение и вежливость</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Конфиденциальность</h4>
                  <p className="text-sm text-muted-foreground">
                    Мы гарантируем полную конфиденциальность всех встреч и персональных данных.
                    Вся информация о клиентах строго защищена.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
