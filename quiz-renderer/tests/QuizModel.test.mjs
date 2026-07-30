import assert from "node:assert/strict";
import test from "node:test";
import { QuizModel } from "../src/QuizModel.js";
import { quiz } from "../src/questions.js";

test("считает полностью правильный результат", () => {
  const model = new QuizModel(quiz);
  model.setAnswer("declaration", "const");
  model.setAnswer("block-scope", ["const", "let"]);
  model.setAnswer("array-check", "true");
  model.setAnswer("dom", " dom ");
  model.setAnswer("strict-equality", "===");

  const result = model.calculateResult();
  assert.equal(result.earnedPoints, 6);
  assert.equal(result.percentage, 100);
  assert.equal(result.correctCount, 5);
  assert.equal(result.unansweredCount, 0);
});

test("обрабатывает неверные и пустые ответы", () => {
  const model = new QuizModel(quiz);
  model.setAnswer("declaration", "let");
  model.setAnswer("block-scope", []);
  model.setAnswer("dom", "   ");

  const result = model.calculateResult();
  assert.equal(result.earnedPoints, 0);
  assert.equal(result.percentage, 0);
  assert.equal(result.unansweredCount, 4);
});

test("для нескольких вариантов требует точное совпадение множества", () => {
  const model = new QuizModel(quiz);
  model.setAnswer("block-scope", ["let", "const", "var"]);
  assert.equal(model.checkQuestion("block-scope").isCorrect, false);

  model.setAnswer("block-scope", ["let", "const", "let"]);
  assert.equal(model.checkQuestion("block-scope").isCorrect, true);
});

test("восстанавливает только валидные ответы", () => {
  const model = new QuizModel(quiz);
  model.importAnswers({
    declaration: "const",
    "strict-equality": "устаревший вариант",
    removedQuestion: "answer",
  });
  assert.equal(model.getAnswer("declaration"), "const");
  assert.equal(model.answeredCount, 1);
});

test("отклоняет тест с неподдерживаемым типом вопроса", () => {
  const brokenQuiz = structuredClone(quiz);
  brokenQuiz.questions[0].type = "rating";
  assert.throws(() => new QuizModel(brokenQuiz), /не поддерживается/);
});

test("отклоняет конфигурацию с отсутствующим правильным вариантом", () => {
  const brokenQuiz = structuredClone(quiz);
  brokenQuiz.questions[0].correctAnswer = "missing";
  assert.throws(() => new QuizModel(brokenQuiz), /существующий вариант/);
});
