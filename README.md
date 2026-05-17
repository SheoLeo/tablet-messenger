# Tablet Messenger

**Tablet Messenger** — это модуль для Foundry VTT (Pathfinder 2e), который добавляет стилизованный интерфейс «планшетного мессенджера» для внутриигрового общения и иммерсивной подачи сообщений.

## Что делает модуль

- добавляет визуальный шаблон мессенджера в стиле планшета;
- подключает кастомные стили интерфейса;
- использует отдельный шаблон `tablet.hbs` для отображения контента.

## Состав модуля

- `scripts/tablet.js` — логика работы модуля;
- `styles/tablet.css` — стили интерфейса;
- `templates/tablet.hbs` — шаблон отображения.

## Совместимость

- Foundry VTT: **v13+**
- Система: **Pathfinder 2e**

## Установка

1. В Foundry VTT откройте **Add-on Modules** → **Install Module**.
2. Вставьте прямую ссылку на манифест модуля (module.json):

```text
https://raw.githubusercontent.com/SheoLeo/tablet-messenger/refs/heads/main/module.json
```

3. Нажмите **Install** и после установки активируйте модуль в **Manage Modules**.

## Скачать модуль

- Репозиторий: [https://github.com/SheoLeo/tablet-messenger](https://github.com/SheoLeo/tablet-messenger)
- Прямая ссылка на `module.json`: [https://raw.githubusercontent.com/SheoLeo/tablet-messenger/refs/heads/main/module.json](https://raw.githubusercontent.com/SheoLeo/tablet-messenger/refs/heads/main/module.json)
