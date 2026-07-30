export class ProgressStorage {
  constructor(quizId, storage = window.localStorage) {
    this.storage = storage;
    this.progressKey = `quiz-renderer:${quizId}:progress`;
    this.historyKey = `quiz-renderer:${quizId}:history`;
  }

  saveProgress(progress) {
    try {
      this.storage.setItem(this.progressKey, JSON.stringify(progress));
    } catch {
      // Приложение продолжит работать, даже если localStorage недоступен.
    }
  }

  loadProgress() {
    try {
      const saved = JSON.parse(this.storage.getItem(this.progressKey));
      return saved && typeof saved === "object" ? saved : null;
    } catch {
      this.clearProgress();
      return null;
    }
  }

  clearProgress() {
    try {
      this.storage.removeItem(this.progressKey);
    } catch {
      // Нет доступа к хранилищу — очищать нечего.
    }
  }

  addAttempt(result) {
    const attempts = this.getHistory();
    attempts.unshift({
      date: new Date().toISOString(),
      percentage: result.percentage,
      score: `${result.earnedPoints}/${result.totalPoints}`,
    });
    try {
      this.storage.setItem(this.historyKey, JSON.stringify(attempts.slice(0, 5)));
    } catch {
      // История — необязательное улучшение.
    }
  }

  getHistory() {
    try {
      const history = JSON.parse(this.storage.getItem(this.historyKey));
      return Array.isArray(history) ? history : [];
    } catch {
      return [];
    }
  }
}
