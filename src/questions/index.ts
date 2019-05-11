import Koa from "koa";
import connection from "../database/connection";
import SuccessEnvelope from "../common/successEnvelope";
import QuestionResourceModel from "./QuestionResourceModel";

export async function Index(context: Koa.Context) {
  console.log(context.query);
  let { page, pageSize } = context.query;
  if (!page || page < 1) page = 1;
  if (!pageSize || pageSize < 1 || pageSize > 100) pageSize = 100;

  let results = await connection.query(`SELECT questions.id, questions.text, COUNT(answers.id) AS 'answerCount'
  FROM questions
    INNER JOIN answers ON questions.id = answers.question_id
  GROUP BY answers.question_id, questions.id, questions.text
  LIMIT ${(page - 1) * pageSize},${pageSize};`);
  let resources = results.map((result: any) => new QuestionResourceModel(result.id, result.text, result.answerCount));

  context.body = new SuccessEnvelope(resources);
};

export async function Get(context: Koa.Context) {
  var { id } = context.params;
  var result = (await connection.query(`SELECT questions.id, questions.text, COUNT(answers.id) AS 'answerCount'
    FROM questions 
      INNER JOIN answers ON questions.id = answers.question_id
    WHERE questions.id = ?
    GROUP BY answers.question_id, questions.id, questions.text;`, [id]))[0]
  
  if (!result) { 
    context.status = 404; 
    context.body = ""; 
    return; 
  }

  var resource = new QuestionResourceModel(result.id, result.text, result.answerCount);

  context.body = new SuccessEnvelope(resource);
};