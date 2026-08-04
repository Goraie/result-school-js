# Result School — JavaScript Projects

Учебный репозиторий с проектами курса Result School по JavaScript. Здесь собраны два приложения на чистых HTML, CSS и JavaScript: блог с асинхронной загрузкой данных и MVC-конструктор тестов.

## Проекты

| Проект | Что демонстрирует | Демо | Исходники |
| --- | --- | --- | --- |
| **Result.blog** | `fetch`, `async/await`, обработку состояний загрузки и ошибок, фильтрацию данных | [Открыть сайт](https://goraie.github.io/result-school-js/) | [`async-final-exercise/`](./async-final-exercise/) |
| **Quiz Renderer** | ООП, MVC, работу с DOM, `localStorage` и модульное тестирование | [Открыть приложение](https://quiz-renderer-ten.vercel.app) | [`quiz-renderer/`](./quiz-renderer/) |

## Result.blog

Небольшой блог, который получает авторов и их публикации из [JSONPlaceholder](https://jsonplaceholder.typicode.com/).

Возможности:

- загрузка списка авторов через Fetch API;
- получение публикаций выбранного автора;
- поиск по заголовку и тексту постов;
- отображение состояний загрузки, пустого результата и ошибки;
- адаптивный интерфейс без сторонних UI-библиотек.

### Локальный запуск

Из корня репозитория запустите статический сервер:

```bash
python3 -m http.server 8080
```

Затем откройте [http://localhost:8080/async-final-exercise/](http://localhost:8080/async-final-exercise/).

Проект автоматически публикуется на GitHub Pages при изменениях в папке `async-final-exercise`.

## Quiz Renderer

Универсальное MVC-приложение, которое строит тест из объекта данных и не зависит от конкретного набора вопросов.

Возможности:

- четыре типа вопросов: один ответ, несколько ответов, «да/нет» и короткий текст;
- навигация между вопросами и проверка обязательных ответов;
- подсчёт баллов и подробный разбор результата;
- восстановление незавершённой попытки из `localStorage`;
- история пяти последних результатов;
- модульные тесты модели на встроенном Node.js Test Runner.

### Архитектура

- `QuizModel` хранит вопросы и ответы, проверяет данные и считает результат;
- `QuizView` создаёт и обновляет интерфейс;
- `QuizController` связывает модель с представлением и управляет сценарием теста;
- `ProgressStorage` изолирует работу с `localStorage`.

Подробное описание архитектуры и сценариев проверки находится в [`quiz-renderer/README.md`](./quiz-renderer/README.md).

### Локальный запуск

```bash
cd quiz-renderer
npm start
```

Приложение будет доступно по адресу [http://localhost:8080](http://localhost:8080).

Запуск тестов:

```bash
cd quiz-renderer
npm test
```

## Структура репозитория

```text
.
├── async-final-exercise/   # Result.blog
├── quiz-renderer/          # MVC-приложение и тесты
└── .github/workflows/      # публикация Result.blog на GitHub Pages
```

## Технологии

- HTML5 и CSS3;
- JavaScript (ES Modules, Fetch API, DOM API);
- ООП и архитектура MVC;
- Web Storage API;
- Node.js Test Runner;
- GitHub Actions, GitHub Pages и Vercel.
