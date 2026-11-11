# JASST STORE: сайт

Сайт магазина одежды JASST STORE: Next.js 16, React 19, Tailwind CSS 4, Framer Motion и Lenis (плавная прокрутка).

## Запуск на компьютере

Нужен Node.js 20 или новее: https://nodejs.org

```bash
npm install
npm run dev
```

Сайт откроется на http://localhost:3000.

Production-сборка:

```bash
npm run build
npm start
```

## Публикация на Vercel (бесплатно)

1. Загрузите эту папку в репозиторий на GitHub.
2. Зайдите на https://vercel.com, нажмите **Add New → Project** и выберите репозиторий.
3. Нажмите **Deploy**, настройки менять не нужно: Vercel сам определит Next.js.
4. Свой домен подключается в **Project → Settings → Domains**.

Без GitHub: `npm i -g vercel`, затем `vercel` в этой папке.

## Где что менять

| Что | Файл |
|---|---|
| Товары: название, бренд, цена, статус, размеры, фото | `lib/products.ts` |
| Ссылка на Telegram (`TELEGRAM_URL`, `TELEGRAM_HANDLE`) | `lib/products.ts` |
| Отзывы | `lib/reviews.ts` |
| Фото товаров | `public/products/<slug>/01.jpg …` |
| Размеры фото и фоновый цвет карточек | `lib/media.json` |
| Логотип | `public/logo-black.png`, `public/logo-white.png` |
| Цвета и шрифты | `app/globals.css`, `app/layout.tsx` |
| Текст заказа, который копируется в Telegram | `lib/order.ts` |

### Как добавить товар

1. Создайте папку `public/products/<slug>/` и положите фото `01.jpg`, `02.jpg` и т.д., лучше 1200×1600.
2. Добавьте запись в `lib/media.json` с размерами каждого фото.
3. Добавьте товар в массив в `lib/products.ts`.

## Устройство

- `components/Hero.tsx`: первый экран и 3D-кольцо с товарами. Кольцо вращается на CSS (`.ring-spin` в `globals.css`) и останавливается, когда уходит с экрана.
- `components/Catalog.tsx`, `ProductCard.tsx`, `ProductSheet.tsx`: каталог, фильтр, карточки и окно товара.
- `components/CartDrawer.tsx` и `Providers.tsx`: корзина в localStorage и оформление через Telegram.
- Облегчённый режим (`html.lite`) включается на слабых устройствах и при низком FPS. Сенсорный режим (`html.touch`) включается на телефонах: там нативная прокрутка и нет эффектов наведения.
- `/readyz`: служебный адрес для проверки, что сервер работает. Его можно удалить.
