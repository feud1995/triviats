import Koa from "koa";
import connection from "../database/connection";
import SuccessEnvelope from "../common/successEnvelope";
import QuestionResourceModel from "../questions/QuestionResourceModel";

class AnswerResourceModel {
  constructor(readonly id: number, readonly questionId: number, readonly text: string, readonly count: number) {}
}

export async function Get(context: Koa.Context) {
  let { questionId } = context.params;
  let question = (await connection.query(`SELECT questions.id, questions.text, COUNT(answers.id) AS 'answerCount'
    FROM questions 
      INNER JOIN answers ON questions.id = answers.question_id
    WHERE questions.id = ?
    GROUP BY answers.question_id, questions.id, questions.text;`, [questionId]))[0];
  let answers = await connection.query("SELECT * FROM answers WHERE question_id = ? ORDER BY count DESC", [questionId]);

  if (!question) {
    context.status = 404
    context.body = ""
    return;
  }
  
  let questionResourceModel = new QuestionResourceModel(question.id, question.text, question.answerCount);
  let answerResourecModels = answers.map((x: any) => new AnswerResourceModel(x.id, x.question_id, x.text, x.count));
  context.body = new SuccessEnvelope({ question: questionResourceModel, answers: answerResourecModels });
}