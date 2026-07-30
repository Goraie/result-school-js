import { QuizController } from "./QuizController.js";
import { QuizModel } from "./QuizModel.js";
import { QuizView } from "./QuizView.js";
import { ProgressStorage } from "./ProgressStorage.js";
import { quiz } from "./questions.js";

const view = new QuizView();

try {
  const model = new QuizModel(quiz);
  const storage = new ProgressStorage(quiz.id);
  const controller = new QuizController(model, view, storage);
  controller.init();
} catch (error) {
  console.error(error);
  view.renderFatalError(error);
}
