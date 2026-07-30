export class QuizController {
  constructor(model, view, storage) {
    this.model = model;
    this.view = view;
    this.storage = storage;
    this.currentIndex = 0;
  }

  init() {
    this.#restoreProgress();
    this.view.renderQuizInfo(this.model.quiz);
    this.view.onAnswer(() => this.#captureAnswer());
    this.view.onBack(() => this.#goTo(this.currentIndex - 1));
    this.view.onNext(() => this.#next());
    this.view.onFinish(() => this.#finish());
    this.view.onRestart(() => this.#restart());
    this.view.renderHistory(this.storage.getHistory());
    this.#render();
  }

  #render() {
    const question = this.model.getQuestion(this.currentIndex);
    this.view.renderQuestion(
      question,
      this.model.getAnswer(question.id),
      this.currentIndex,
      this.model.questions.length,
    );
    this.view.renderProgress(
      this.currentIndex,
      this.model.questions.length,
      this.model.answeredCount,
    );
    this.view.renderNavigation(this.currentIndex, this.model.questions.length);
  }

  #captureAnswer() {
    const question = this.model.getQuestion(this.currentIndex);
    this.model.setAnswer(question.id, this.view.getCurrentAnswer(question));
    this.view.clearValidation();
    this.view.renderProgress(
      this.currentIndex,
      this.model.questions.length,
      this.model.answeredCount,
    );
    this.#saveProgress();
  }

  #next() {
    this.#captureAnswer();
    const question = this.model.getQuestion(this.currentIndex);
    if (!this.model.isAnswered(question.id)) {
      this.view.showValidation("Выберите или введите ответ, чтобы продолжить.");
      return;
    }
    this.#goTo(this.currentIndex + 1);
  }

  #finish() {
    this.#captureAnswer();
    const question = this.model.getQuestion(this.currentIndex);
    if (!this.model.isAnswered(question.id)) {
      this.view.showValidation("Ответьте на последний вопрос перед завершением.");
      return;
    }

    const result = this.model.calculateResult();
    this.storage.addAttempt(result);
    this.storage.clearProgress();
    this.view.renderResult(result, this.#formatAnswer);
    this.view.renderHistory(this.storage.getHistory());
  }

  #goTo(index) {
    if (index < 0 || index >= this.model.questions.length) return;
    this.#captureAnswer();
    this.currentIndex = index;
    this.#saveProgress();
    this.#render();
  }

  #restart() {
    this.model.reset();
    this.currentIndex = 0;
    this.storage.clearProgress();
    this.view.showQuiz();
    this.#render();
  }

  #saveProgress() {
    this.storage.saveProgress({
      quizId: this.model.quiz.id,
      currentIndex: this.currentIndex,
      answers: this.model.exportAnswers(),
    });
  }

  #restoreProgress() {
    const progress = this.storage.loadProgress();
    if (!progress || progress.quizId !== this.model.quiz.id) return;

    this.model.importAnswers(progress.answers);
    if (
      Number.isInteger(progress.currentIndex) &&
      progress.currentIndex >= 0 &&
      progress.currentIndex < this.model.questions.length
    ) {
      this.currentIndex = progress.currentIndex;
    }
  }

  #formatAnswer(answer) {
    if (answer === undefined || answer === null || answer === "") return "нет ответа";
    if (Array.isArray(answer)) return answer.length ? answer.join(", ") : "нет ответа";
    if (answer === true) return "Да";
    if (answer === false) return "Нет";
    return String(answer);
  }
}
