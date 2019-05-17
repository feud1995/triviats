import Question from "./question";
import Answer from "./answer";

import connection from "../database/connection";

export async function findQuestionById(id: number) : Promise<Question> {
  let question: Question = (await connection.query(`SELECT questions.id, questions.text, COUNT(answers.id) AS 'answerCount'
    FROM questions 
      INNER JOIN answers ON questions.id = answers.question_id
    WHERE questions.id = ?
    GROUP BY answers.question_id, questions.id, questions.text;`, [id]))[0]

  return question;
}

export async function findQuestions(offset: number = 0, limit: number = 100) : Promise<Array<Question>> {
  let sql = `SELECT questions.id, questions.text
            FROM questions
            LIMIT ${offset},${limit};`;
  
  let results: Array<Question> = await connection.query(sql);

  return results;
}

export async function findAnswers(questionId: number) : Promise<Array<Answer>> {
  let query = "SELECT * FROM answers WHERE question_id = ?";
  let answers: Array<Answer> = (await connection.query(query, [questionId]));
  return answers;
}

export async function getCount() : Promise<number> {
  let query = "SELECT COUNT(*) AS 'count' FROM questions;"
  let count: number = (await connection.query(query))[0].count;

  return count;
}

export default {
  findQuestionById,
  findQuestions,
  findAnswers,
  getCount,
}