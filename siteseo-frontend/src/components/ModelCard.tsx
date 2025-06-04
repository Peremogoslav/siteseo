import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Model } from "@/lib/api";

interface ModelCardProps {
  model: Model;
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={model.photo_url || "/placeholder-model.jpg"}
          alt={`Фото ${model.name} - элитное эскорт сопровождение`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Name overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl font-semibold mb-2">{model.name}</h3>
          {model.place && (
            <Badge variant="secondary" className="bg-white/90 text-black">
              {model.place}
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {model.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {model.height && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Рост:</span>
              <span>{model.height}</span>
            </div>
          )}
          {model.weight && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Вес:</span>
              <span>{model.weight}</span>
            </div>
          )}
          {model.boobs && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Размер:</span>
              <span>{model.boobs}</span>
            </div>
          )}
        </div>

        {/* Prices */}
        <div className="space-y-1 mb-4">
          {model.price_per_hour && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Час:</span>
              <span className="font-semibold">{model.price_per_hour}</span>
            </div>
          )}
          {model.price_per_night && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ночь:</span>
              <span className="font-semibold">{model.price_per_night}</span>
            </div>
          )}
        </div>

        {/* Services */}
        {model.services.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {model.services.slice(0, 3).map((service) => (
                <Badge key={service.id} variant="outline" className="text-xs">
                  {service.name}
                </Badge>
              ))}
              {model.services.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{model.services.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* View Profile Link */}
        <Link
          href={`/models/${model.slug}`}
          className="block w-full py-2 px-4 bg-primary text-primary-foreground text-center rounded-md text-sm font-medium transition-colors hover:bg-primary/90"
        >
          Смотреть профиль
        </Link>
      </CardContent>
    </Card>
  );
}
