"use client";

import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ModelCard } from "@/components/ModelCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useModelsStore } from "@/store/models";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function HomePage() {
  const {
    models,
    services,
    isLoading,
    currentPage,
    searchQuery,
    selectedServices,
    selectedPlace,
    fetchModels,
    fetchServices,
    setSearchQuery,
    setSelectedServices,
    setSelectedPlace,
    setPage,
    resetFilters,
  } = useModelsStore();

  useEffect(() => {
    fetchModels();
    fetchServices();
  }, [fetchModels, fetchServices]);

  // Get unique places from models
  const uniquePlaces = [...new Set(models.map(model => model.place).filter(Boolean))];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-slate-900 to-slate-700">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Elite Escort
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-slate-200">
                Элитное эскорт-сопровождение премиум класса
              </p>
              <p className="text-lg mb-8 text-slate-300">
                Красивые, образованные девушки для деловых встреч,
                светских мероприятий и частного общения
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="#models">Смотреть каталог</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Связаться с нами</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Models Catalog */}
        <section id="models" className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Наши модели
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Познакомьтесь с нашими элитными спутницами.
                Каждая модель прошла тщательный отбор и обладает безупречной репутацией.
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8 p-6 bg-card rounded-lg border">
              <div className="space-y-4">
                {/* Search and Location */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Поиск по имени или описанию..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <Select value={selectedPlace} onValueChange={setSelectedPlace}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Выберите город" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Все города</SelectItem>
                      {uniquePlaces.map((place) => (
                        <SelectItem key={place} value={place || ""}>
                          {place}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={resetFilters}>
                    Сбросить фильтры
                  </Button>
                </div>

                {/* Services Filter */}
                {services.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-3">Услуги:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {services.map((service) => (
                        <div key={service.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`service-${service.id}`}
                            checked={selectedServices.includes(service.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedServices([...selectedServices, service.id]);
                              } else {
                                setSelectedServices(selectedServices.filter(id => id !== service.id));
                              }
                            }}
                          />
                          <label
                            htmlFor={`service-${service.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {service.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Active Filters */}
              {(searchQuery || selectedPlace || selectedServices.length > 0) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {searchQuery && (
                    <Badge variant="secondary">
                      Поиск: {searchQuery}
                    </Badge>
                  )}
                  {selectedPlace && (
                    <Badge variant="secondary">
                      Город: {selectedPlace}
                    </Badge>
                  )}
                  {selectedServices.map((serviceId) => {
                    const service = services.find(s => s.id === serviceId);
                    return service ? (
                      <Badge key={serviceId} variant="secondary">
                        {service.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            {/* Models Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={`models-skeleton-${i}`} className="animate-pulse">
                    <div className="aspect-[3/4] bg-muted rounded-lg mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : models.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {models.map((model) => (
                    <ModelCard key={model.uuid} model={model} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-12 flex justify-center">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                    >
                      Предыдущая
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setPage(currentPage + 1)}
                      disabled={models.length < 12}
                    >
                      Следующая
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  Модели не найдены. Попробуйте изменить параметры поиска.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Почему выбирают нас
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-primary-foreground">★</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Премиум качество</h3>
                <p className="text-muted-foreground">
                  Только проверенные модели с безупречной репутацией и высоким уровнем образования
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-primary-foreground">🔒</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Конфиденциальность</h3>
                <p className="text-muted-foreground">
                  Полная анонимность и конфиденциальность всех встреч и личных данных
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-primary-foreground">24</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Доступность</h3>
                <p className="text-muted-foreground">
                  Круглосуточная поддержка и возможность организации встреч в любое время
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
