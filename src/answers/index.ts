import Koa from "koa";
import connection from "../database/connection";
import SuccessEnvelope from "../common/successEnvelope";
import QuestionResourceModel from "../questions/QuestionResourceModel";

import Questions from "../questions/questions";

class AnswerResourceModel {
  constructor(readonly id: number, readonly questionId: number, readonly text: string, readonly count: number) {}
}

export async function Get(context: Koa.Context) {
  let { questionId } = context.params;
  let question = await Questions.findQuestionById(questionId);
  let answers = await Questions.findAnswers(question.id);

  if (!question) {
    context.status = 404
    context.body = ""
    return;
  }
  
  let questionResourceModel = new QuestionResourceModel(question.id, question.text, answers.length);
  let answerResourecModels = answers.map((x: any) => new AnswerResourceModel(x.id, x.question_id, x.text, x.count));

  context.body = new SuccessEnvelope({ question: questionResourceModel, answers: answerResourecModels });
}