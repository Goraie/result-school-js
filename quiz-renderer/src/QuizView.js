export class QuizView {
  constructor(documentRoot = document) {
    this.document = documentRoot;
    this.elements = {
      title: documentRoot.querySelector("#quiz-title"),
      description: documentRoot.querySelector("#quiz-description"),
      quizPanel: documentRoot.querySelector("#quiz-panel"),
      question: documentRoot.querySelector("#question-container"),
      form: documentRoot.querySelector("#question-form"),
      validation: documentRoot.querySelector("#validation-message"),
      progressText: documentRoot.querySelector("#progress-text"),
      answeredText: documentRoot.querySelector("#answered-text"),
      progressBar: documentRoot.querySelector("#progress-bar"),
      back: documentRoot.querySelector("#back-button"),
      next: documentRoot.querySelector("#next-button"),
      finish: documentRoot.querySelector("#finish-button"),
      result: documentRoot.querySelector("#result-panel"),
      history: documentRoot.querySelector("#history-panel"),
    };
  }

  renderQuizInfo(quiz) {
    this.elements.title.textContent = quiz.title;
    this.elements.description.textContent = quiz.description;
  }

  renderQuestion(question, savedAnswer, index, total) {
    const container = this.elements.question;
    container.replaceChildren();
    this.clearValidation();

    const number = this.#element("p", "question-number", `Вопрос ${index + 1} из ${total}`);
    const title = this.#element("h2", "question-title", question.text);
    title.id = "question-title";
    container.append(number, title);

    if (question.type === "text") {
      container.append(this.#renderTextInput(question, savedAnswer));
    } else {
      container.append(this.#renderOptions(question, savedAnswer));
    }
  }

  renderProgress(index, total, answeredCount) {
    this.elements.progressText.textContent = `${index + 1} / ${total}`;
    this.elements.answeredText.textContent = `Отвечено: ${answeredCount}`;
    this.elements.progressBar.style.width = `${((index + 1) / total) * 100}%`;
  }

  renderNavigation(index, total) {
    this.elements.back.disabled = index === 0;
    this.elements.next.hidden = index === total - 1;
    this.elements.finish.hidden = index !== total - 1;
  }

  getCurrentAnswer(question) {
    if (question.type === "multiple") {
      return [...this.elements.form.querySelectorAll('input[name="answer"]:checked')].map(
        (input) => input.value,
      );
    }
    if (question.type === "text") {
      return this.elements.form.querySelector('input[name="answer"]')?.value ?? "";
    }
    return this.elements.form.querySelector('input[name="answer"]:checked')?.value ?? "";
  }

  showValidation(message) {
    this.elements.validation.textContent = message;
  }

  clearValidation() {
    this.elements.validation.textContent = "";
  }

  renderResult(result, formatAnswer) {
    const panel = this.elements.result;
    panel.replaceChildren();

    const score = this.#element("div", "score");
    const value = this.#element("div", "score-value", `${result.percentage}%`);
    const summary = this.#element("div");
    summary.append(
      this.#element("h2", "", "Тест завершён"),
      this.#element(
        "p",
        "",
        `${result.earnedPoints} из ${result.totalPoints} баллов · ${result.correctCount} верных ответов`,
      ),
    );
    score.append(value, summary);

    const reviewList = this.#element("div", "review-list");
    result.details.forEach((detail, index) => {
      const review = this.#element("article", `review${detail.isCorrect ? " correct" : ""}`);
      review.append(
        this.#element("h3", "", `${index + 1}. ${detail.question}`),
        this.#element(
          "p",
          "review-answer",
          `${detail.isCorrect ? "Верно" : "Неверно"} · Ваш ответ: ${formatAnswer(detail.userAnswer)}`,
        ),
        this.#element(
          "p",
          "review-answer",
          `Правильный ответ: ${formatAnswer(detail.correctAnswer)}. ${detail.explanation}`,
        ),
      );
      reviewList.append(review);
    });

    const restart = this.#element("button", "button", "Пройти ещё раз");
    restart.type = "button";
    restart.dataset.action = "restart";
    panel.append(score, reviewList, restart);
    this.elements.quizPanel.hidden = true;
    panel.hidden = false;
    panel.focus();
  }

  renderHistory(attempts) {
    const panel = this.elements.history;
    panel.replaceChildren();
    if (!attempts.length) return;

    const list = this.#element("ul", "history-list");
    attempts.forEach((attempt) => {
      const date = new Intl.DateTimeFormat("ru-RU", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(attempt.date));
      list.append(this.#element("li", "", `${date} · ${attempt.percentage}% (${attempt.score})`));
    });
    const heading = this.#element("h2", "", "Последние попытки");
    heading.id = "history-title";
    panel.append(heading, list);
  }

  showQuiz() {
    this.elements.result.hidden = true;
    this.elements.quizPanel.hidden = false;
  }

  renderFatalError(error) {
    this.elements.title.textContent = "Не удалось запустить тест";
    this.elements.description.textContent =
      "Проверьте структуру данных в questions.js и обновите страницу.";
    this.elements.quizPanel.hidden = true;
    this.elements.history.hidden = true;
    this.elements.result.replaceChildren(
      this.#element("h2", "", "Ошибка конфигурации"),
      this.#element("p", "review-answer", error.message || "Неизвестная ошибка."),
    );
    this.elements.result.hidden = false;
  }

  onBack(handler) {
    this.elements.back.addEventListener("click", handler);
  }

  onNext(handler) {
    this.elements.next.addEventListener("click", handler);
  }

  onFinish(handler) {
    this.elements.finish.addEventListener("click", handler);
  }

  onAnswer(handler) {
    this.elements.form.addEventListener("input", handler);
  }

  onRestart(handler) {
    this.elements.result.addEventListener("click", (event) => {
      if (event.target.closest('[data-action="restart"]')) handler();
    });
  }

  #renderOptions(question, savedAnswer) {
    const fieldset = this.#element("fieldset", "answers");
    fieldset.setAttribute("aria-labelledby", "question-title");
    const savedValues = Array.isArray(savedAnswer) ? savedAnswer : [savedAnswer];

    question.options.forEach((option) => {
      const label = this.#element("label", "answer");
      const input = this.document.createElement("input");
      input.type = question.type === "multiple" ? "checkbox" : "radio";
      input.name = "answer";
      input.value = option.value;
      input.checked = savedValues.some((value) => String(value) === option.value);
      label.append(input, this.document.createTextNode(option.label));
      fieldset.append(label);
    });
    return fieldset;
  }

  #renderTextInput(question, savedAnswer) {
    const wrapper = this.document.createElement("div");
    const input = this.document.createElement("input");
    input.className = "text-answer";
    input.name = "answer";
    input.type = "text";
    input.autocomplete = "off";
    input.placeholder = question.placeholder ?? "Введите ответ";
    input.value = savedAnswer ?? "";
    input.setAttribute("aria-labelledby", "question-title");
    wrapper.append(input, this.#element("p", "hint", "Регистр букв не важен."));
    return wrapper;
  }

  #element(tag, className = "", text = "") {
    const element = this.document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }
}
