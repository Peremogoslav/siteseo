"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { modelsApi, type Model } from "@/lib/api";
import { ArrowLeft, Edit, Trash2, Plus, Search, Users } from "lucide-react";

export default function ManageModelsPage() {
  const { user } = useAuthStore();
  const { models, fetchModels } = useModelsStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModel, setDeleteModel] = useState<Model | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push("/");
      return;
    }
    fetchModels();
  }, [user, router, fetchModels]);

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.place?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteModel = async (model: Model) => {
    setIsDeleting(true);
    try {
      await modelsApi.delete(model.uuid);
      setDeleteModel(null);
      fetchModels(); // Обновляем список
      alert("Модель успешно удалена!");
    } catch (error) {
      console.error("Ошибка при удалении модели:", error);
      alert("Произошла ошибка при удалении модели");
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
                <h1 className="text-3xl font-bold mb-2">Управление моделями</h1>
                <p className="text-muted-foreground">
                  Редактируйте профили моделей и управляйте контентом
                </p>
              </div>

              <Button asChild>
                <Link href="/admin/models/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить модель
                </Link>
              </Button>
            </div>
          </div>

          {/* Поиск и статистика */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Поиск по имени, городу или описанию..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-primary" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Всего моделей</p>
                      <p className="text-2xl font-bold">{models.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="h-4 w-4 bg-green-500 rounded-full" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">С фото</p>
                      <p className="text-2xl font-bold">
                        {models.filter(m => m.photo_url).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">₽</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">С ценами</p>
                      <p className="text-2xl font-bold">
                        {models.filter(m => m.price_per_hour).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Список моделей */}
          <Card>
            <CardHeader>
              <CardTitle>
                Модели ({filteredModels.length})
              </CardTitle>
              <CardDescription>
                {searchQuery
                  ? `Найдено ${filteredModels.length} моделей по запросу "${searchQuery}"`
                  : "Список всех моделей в системе"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredModels.length > 0 ? (
                <div className="space-y-4">
                  {filteredModels.map((model) => (
                    <div
                      key={model.uuid}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          {model.photo_url ? (
                            <img
                              src={model.photo_url}
                              alt={model.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Users className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">{model.name}</h3>
                            <Badge variant="outline">{model.place || "Город не указан"}</Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {model.description}
                          </p>

                          <div className="flex flex-wrap gap-2 text-xs">
                            {model.price_per_hour && (
                              <Badge variant="secondary">
                                {model.price_per_hour}₽/час
                              </Badge>
                            )}
                            {model.height && (
                              <Badge variant="secondary">
                                {model.height}см
                              </Badge>
                            )}
                            {model.services.length > 0 && (
                              <Badge variant="secondary">
                                {model.services.length} услуг
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/models/${model.slug}`}>
                            Просмотр
                          </Link>
                        </Button>

                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/models/${model.uuid}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteModel(model)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchQuery ? "Модели не найдены" : "Пока нет моделей"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "Попробуйте изменить условия поиска"
                      : "Начните с создания первого профиля модели"
                    }
                  </p>
                  {!searchQuery && (
                    <Button asChild>
                      <Link href="/admin/models/create">
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить модель
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      {/* Диалог подтверждения удаления */}
      <Dialog open={!!deleteModel} onOpenChange={() => setDeleteModel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить модель "{deleteModel?.name}"?
              Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteModel(null)}
              disabled={isDeleting}
            >
              Отменить
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteModel && handleDeleteModel(deleteModel)}
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
