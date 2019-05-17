import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-body";

import * as questions from "./questions";
import * as answers from "./answers";
import * as statistics from "./statistics";

const port = process.env.PORT || 5000;

const app = new Koa();
const router = new Router({ prefix: '/v1'});

app.use(bodyParser());

router.get("/questions", questions.Index);
router.get("/questions/random", questions.Random);
router.get("/questions/:id", questions.Get);

router.get('/questions/:questionId/answers', answers.Get);

router.get('/statistics', statistics.Index);

app.use(router.routes());

app.listen(port);

console.log(`Server started on http://localhost:${port}`);