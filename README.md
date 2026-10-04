# FominDota

Сайт со статистикой Dota 2.

## Запуск

```
npm install
npm start
```

Откройте http://localhost:5173

## Игроки

Список игроков на главной странице: `src/players.ts`.

## Деплой

GitHub Pages через `.github/workflows/deploy.yml`.

### Настройка GitHub Pages

1. Settings → Pages → Source: **GitHub Actions**.
2. Сделайте push в `main`/`master` — сайт соберётся и опубликуется автоматически.
3. Адрес: `https://<user>.github.io/<repo>/`. Базовый путь (`BASE_PATH`) подставляется
   в workflow автоматически из имени репозитория.
4. Для локальной проверки подпапки: `BASE_PATH=/<repo>/ npm run build && npm run preview`.

Заметки:
- Все переменные `VITE_*` попадают в публичный бандл — не кладите туда секреты.
- `GITHUB_REPO` в `src/config.ts` задаёт ссылку «Report a bug»; пока он пуст, пункт скрыт.
- Страница `404.html` — копия `index.html` (SPA-фолбэк для прямых ссылок вроде `/players/123`).
