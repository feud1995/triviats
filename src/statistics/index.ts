import Koa from "koa";
import connection from "../database/connection";
import SuccessEnvelope from "../common/successEnvelope";

export async function Index(context: Koa.Context) {
  let questions = (await connection.query("SELECT COUNT(*) AS 'count' FROM questions;"))[0];
  let answers = (await connection.query("SELECT COUNT(*) AS 'count', SUM(count) AS 'sum' FROM answers;"))[0];

  context.body = new SuccessEnvelope({ totalQuestions: questions.count, totalAnswers: answers.count, totalSurveyed: answers.sum });
};