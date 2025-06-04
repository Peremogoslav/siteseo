import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Компания */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Elite Escort</h3>
            <p className="text-sm text-muted-foreground">
              Элитное эскорт-сопровождение премиум класса.
              Профессиональные услуги для деловых встреч и светских мероприятий.
            </p>
          </div>

          {/* Услуги */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Услуги</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services/business" className="text-muted-foreground hover:text-foreground">
                  Деловое сопровождение
                </Link>
              </li>
              <li>
                <Link href="/services/events" className="text-muted-foreground hover:text-foreground">
                  Светские мероприятия
                </Link>
              </li>
              <li>
                <Link href="/services/travel" className="text-muted-foreground hover:text-foreground">
                  Сопровождение в поездках
                </Link>
              </li>
              <li>
                <Link href="/services/private" className="text-muted-foreground hover:text-foreground">
                  Частные встречи
                </Link>
              </li>
            </ul>
          </div>

          {/* Информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Информация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Условия использования
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Связь с нами</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Доступны 24/7</p>
              <p>Конфиденциальность гарантирована</p>
              <p>Профессиональный подход</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Elite Escort. Все права защищены.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <Link href="/sitemap" className="text-sm text-muted-foreground hover:text-foreground">
                Карта сайта
              </Link>
              <Link href="/robots.txt" className="text-sm text-muted-foreground hover:text-foreground">
                Robots.txt
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
