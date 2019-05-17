import Koa from "koa";
import connection from "../database/connection";
import SuccessEnvelope from "../common/successEnvelope";
import QuestionResourceModel from "./QuestionResourceModel";

import Question from "./question";
import Questions from "./questions";

export async function Index(context: Koa.Context) {
  let { page, pageSize } = context.query;
  if (!page || page < 1) page = 1;
  if (!pageSize || pageSize < 1 || pageSize > 100) pageSize = 100;

  let offset = (page - 1) * pageSize;

  var questions = await Questions.findQuestions(offset, pageSize);
  
  var data = {
    meta: {
      page: page,
      pageSize: pageSize
    },
    results: questions
  };
  context.body = new SuccessEnvelope(data);
};

export async function Get(context: Koa.Context) {
  var { id } = context.params;
  var question = await Questions.findQuestionById(id);
  var answers = await Questions.findAnswers(question.id);
  
  if (!question) { 
    context.status = 404; 
    context.body = ""; 
    return; 
  }

  var resource = new QuestionResourceModel(question.id, question.text, answers.length);

  context.body = new SuccessEnvelope(resource);
};

export async function Random(context: Koa.Context) {
  let questionCount = await Questions.getCount();
  let random = (min: number, max: number) => Math.floor(Math.random() * max) + min;
  let questionId = random(1, questionCount);

  let question = await Questions.findQuestionById(questionId);
  context.body = new SuccessEnvelope(question);
}