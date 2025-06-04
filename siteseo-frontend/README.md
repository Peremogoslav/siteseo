# Elite Escort Frontend

Современный веб-интерфейс для сайта элитного эскорт-сопровождения, построенный на Next.js с TypeScript.

## 🚀 Особенности

- **Элегантный дизайн** - Премиум интерфейс для элитных услуг
- **SEO-оптимизация** - Полная поддержка поисковых систем
- **Адаптивность** - Отлично работает на всех устройствах
- **TypeScript** - Типобезопасность и лучший DX
- **Современный стек** - Next.js 15, Tailwind CSS, shadcn/ui

## 🛠 Технологии

- [Next.js 15](https://nextjs.org/) - React фреймворк
- [TypeScript](https://www.typescriptlang.org/) - Типизация
- [Tailwind CSS](https://tailwindcss.com/) - Стилизация
- [shadcn/ui](https://ui.shadcn.com/) - UI компоненты
- [Zustand](https://zustand-demo.pmnd.rs/) - Управление состоянием
- [Axios](https://axios-http.com/) - HTTP клиент
- [Lucide React](https://lucide.dev/) - Иконки

## 📦 Установка

1. **Клонировать репозиторий**
```bash
git clone <repository-url>
cd siteseo-frontend
```

2. **Установить зависимости**
```bash
bun install
# или
npm install
```

3. **Настроить переменные окружения**
```bash
cp .env.local.example .env.local
```

Отредактируйте `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_NAME=Elite Escort
NEXT_PUBLIC_SITE_DOMAIN=yourdomain.com
```

4. **Запустить dev сервер**
```bash
bun run dev
# или
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 🔧 Конфигурация API

Убедитесь, что ваш FastAPI backend запущен на `http://localhost:8000` (или обновите `NEXT_PUBLIC_API_URL` в `.env.local`).

### Требуемые эндпоинты:

- `GET /models/all-model` - Список моделей
- `GET /models/{slug}` - Детали модели
- `POST /models/create` - Создание модели (admin)
- `PUT /models/update-{id}` - Обновление модели (admin)
- `DELETE /models/delete-{id}` - Удаление модели (admin)
- `GET /services/all-services` - Список услуг
- `POST /services/add-service` - Добавление услуги (admin)
- `POST /login` - Авторизация
- `POST /register` - Регистрация
- `GET /user_protected` - Профиль пользователя
- `GET /admin_protected` - Админ проверка

## 🎨 Структура проекта

```
src/
├── app/                 # Next.js App Router
│   ├── admin/          # Админ-панель
│   ├── login/          # Страница входа
│   ├── register/       # Страница регистрации
│   ├── models/         # Страницы моделей
│   └── layout.tsx      # Корневой layout
├── components/         # React компоненты
│   ├── layout/         # Layout компоненты
│   └── ui/             # shadcn/ui компоненты
├── lib/                # Утилиты и API
├── store/              # Zustand stores
└── styles/             # Стили
```

## 🔐 Аутентификация

Система поддерживает:
- JWT токены
- Роли пользователей (user/admin)
- Защищенные маршруты
- Автоматическое перенаправление

**Тестовые данные:**
- Админ: `admin` / `admin`
- Пользователь: создайте через регистрацию

## 📱 Responsive Design

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Продакшен

1. **Сборка**
```bash
bun run build
```

2. **Запуск**
```bash
bun run start
```

3. **Деплой на Netlify**
- Настройте переменные окружения
- Подключите репозиторий
- Автоматический деплой при push

## 🔍 SEO Оптимизация

- Динамические meta теги
- Open Graph теги
- Structured Data (JSON-LD)
- Sitemap.xml
- Robots.txt
- Оптимизированные изображения
- Семантическая разметка

## 📋 TODO

- [ ] Фильтрация по услугам
- [ ] Админ-формы для создания/редактирования
- [ ] Загрузка файлов
- [ ] Уведомления (toast)
- [ ] Поиск в реальном времени
- [ ] Избранное
- [ ] Мультиязычность

## 🤝 Разработка

1. Создайте ветку для новой функции
2. Внесите изменения
3. Запустите линтер: `bun run lint`
4. Сделайте коммит и пуш
5. Создайте Pull Request

## 📄 Лицензия

Приватный проект. Все права защищены.
