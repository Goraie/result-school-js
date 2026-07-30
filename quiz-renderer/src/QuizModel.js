const SUPPORTED_TYPES = new Set(["single", "multiple", "boolean", "text"]);

export class QuizModel {
  constructor(quiz) {
    this.#validateQuiz(quiz);
    this.quiz = structuredClone(quiz);
    this.answers = new Map();
  }

  get questions() {
    return this.quiz.questions;
  }

  get totalPoints() {
    return this.questions.reduce((sum, question) => sum + question.points, 0);
  }

  get answeredCount() {
    return this.answers.size;
  }

  getQuestion(index) {
    if (!Number.isInteger(index) || index < 0 || index >= this.questions.length) {
      throw new RangeError("Вопрос с таким индексом не существует.");
    }
    return this.questions[index];
  }

  getAnswer(questionId) {
    return this.answers.get(questionId);
  }

  setAnswer(questionId, rawAnswer) {
    const question = this.#findQuestion(questionId);
    const answer = this.#normalizeAnswer(question, rawAnswer);

    if (!this.#isMeaningfulAnswer(answer)) {
      this.answers.delete(questionId);
      return;
    }
    this.answers.set(questionId, answer);
  }

  isAnswered(questionId) {
    return this.answers.has(questionId);
  }

  checkQuestion(questionId) {
    const question = this.#findQuestion(questionId);
    const userAnswer = this.answers.get(questionId);
    const isCorrect = this.#isCorrect(question, userAnswer);

    return {
      questionId,
      question: question.text,
      userAnswer,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      isCorrect,
      earnedPoints: isCorrect ? question.points : 0,
      maxPoints: question.points,
    };
  }

  calculateResult() {
    const details = this.questions.map((question) => this.checkQuestion(question.id));
    const earnedPoints = details.reduce((sum, item) => sum + item.earnedPoints, 0);
    const correctCount = details.filter((item) => item.isCorrect).length;

    return {
      earnedPoints,
      totalPoints: this.totalPoints,
      percentage: Math.round((earnedPoints / this.totalPoints) * 100),
      correctCount,
      totalQuestions: this.questions.length,
      unansweredCount: this.questions.length - this.answeredCount,
      details,
    };
  }

  exportAnswers() {
    return Object.fromEntries(this.answers);
  }

  importAnswers(savedAnswers = {}) {
    this.answers.clear();
    if (!savedAnswers || typeof savedAnswers !== "object" || Array.isArray(savedAnswers)) return;

    for (const [questionId, answer] of Object.entries(savedAnswers)) {
      try {
        this.setAnswer(questionId, answer);
      } catch {
        // Старые ответы на удалённые вопросы безопасно игнорируются.
      }
    }
  }

  reset() {
    this.answers.clear();
  }

  #findQuestion(questionId) {
    const question = this.questions.find((item) => item.id === questionId);
    if (!question) throw new Error(`Неизвестный вопрос: ${questionId}`);
    return question;
  }

  #normalizeAnswer(question, rawAnswer) {
    if (question.type === "multiple") {
      const values = Array.isArray(rawAnswer) ? rawAnswer : [];
      const normalized = [...new Set(values.map(String))].sort();
      const allowedValues = new Set(question.options.map((option) => option.value));
      if (normalized.some((value) => !allowedValues.has(value))) {
        throw new TypeError("Ответ содержит неизвестный вариант.");
      }
      return normalized;
    }
    if (question.type === "boolean") {
      if (rawAnswer === true || rawAnswer === "true") return true;
      if (rawAnswer === false || rawAnswer === "false") return false;
      return null;
    }
    if (question.type === "text") return String(rawAnswer ?? "").trim();
    const normalized = rawAnswer == null ? "" : String(rawAnswer);
    const allowedValues = new Set(question.options.map((option) => option.value));
    if (normalized && !allowedValues.has(normalized)) {
      throw new TypeError("Ответ содержит неизвестный вариант.");
    }
    return normalized;
  }

  #isMeaningfulAnswer(answer) {
    if (Array.isArray(answer)) return answer.length > 0;
    return answer !== "" && answer !== null && answer !== undefined;
  }

  #isCorrect(question, userAnswer) {
    if (!this.#isMeaningfulAnswer(userAnswer)) return false;
    if (question.type === "multiple") {
      return JSON.stringify(userAnswer) === JSON.stringify([...question.correctAnswer].sort());
    }
    if (question.type === "text") {
      const normalized = userAnswer.toLocaleLowerCase("ru-RU");
      return question.acceptedAnswers.some(
        (answer) => answer.trim().toLocaleLowerCase("ru-RU") === normalized,
      );
    }
    return userAnswer === question.correctAnswer;
  }

  #validateQuiz(quiz) {
    if (!quiz || typeof quiz !== "object") throw new TypeError("Нужен объект теста.");
    if (!quiz.id || !quiz.title) throw new TypeError("У теста должны быть id и title.");
    if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
      throw new TypeError("Тест должен содержать вопросы.");
    }

    const ids = new Set();
    for (const question of quiz.questions) {
      if (!question.id || ids.has(question.id)) throw new TypeError("id вопросов должны быть уникальными.");
      if (!SUPPORTED_TYPES.has(question.type)) throw new TypeError(`Тип ${question.type} не поддерживается.`);
      if (!question.text || !Number.isFinite(question.points) || question.points <= 0) {
        throw new TypeError("У вопроса должны быть текст и положительное число points.");
      }
      if (question.type === "text" && !question.acceptedAnswers?.length) {
        throw new TypeError("Для текстового вопроса нужны acceptedAnswers.");
      }
      if (question.type !== "text") {
        if (!Array.isArray(question.options) || question.options.length < 2) {
          throw new TypeError("Вопрос с выбором должен содержать минимум два варианта.");
        }
        const values = question.options.map((option) => option.value);
        if (
          question.options.some((option) => !option.label || typeof option.value !== "string") ||
          new Set(values).size !== values.length
        ) {
          throw new TypeError("Варианты должны иметь уникальные строковые value и непустые label.");
        }
        const correctValues = Array.isArray(question.correctAnswer)
          ? question.correctAnswer
          : [String(question.correctAnswer)];
        if (correctValues.some((value) => !values.includes(value))) {
          throw new TypeError("Правильный ответ должен ссылаться на существующий вариант.");
        }
      }
      ids.add(question.id);
    }
  }
}
