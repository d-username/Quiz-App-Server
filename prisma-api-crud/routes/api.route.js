const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.get('/quiz', async (req, res, next) => {
  try {
    const quizes = await prisma.quiz.findMany({
      include: {
        questions: {
          include: { answers: true },
        },
      },
    });

    res.json({ quizes });
  } catch (error) {
    next(error);
  }
});

// router.get('/products/:id', async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const product = await prisma.product.findUnique({
//       where: {
//         id: Number(id),
//       },
//     });
//     res.json(product);
//   } catch (error) {
//     next(error);
//   }
// });

router.post('/quiz', async (req, res, next) => {
  const data = req.body;

  try {
    const quiz = await prisma.quiz.create({
      data: {
        title: data.title,
      },
    });

    let currentQuizID = quiz.id;

    for (let i = 0; i < data.questions.length; i++) {
      let currentQuestion = data.questions[i];
      const question = await prisma.question.create({
        data: {
          quizId: Number(currentQuizID),
          question: currentQuestion.question,
        },
      });

      let currentQuestionID = question.id;

      for (let a = 0; a < currentQuestion.answerList.length; a++) {
        let currentAnswer = currentQuestion.answerList[a];
        const answer = await prisma.answer.create({
          data: {
            questionId: currentQuestionID,
            answer: currentAnswer.answer,
            isThisCorrect: currentAnswer.isThisCorrect,
          },
        });
      }
    }

    res.json(quiz);
  } catch (error) {
    next(error);
  }
});

router.delete('/quiz/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedQuiz = await prisma.quiz.delete({
      where: {
        id: Number(id),
      },
    });
    res.json(deletedQuiz);
  } catch (error) {
    next(error);
  }
});

// router.patch('/products/:id', async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const product = await prisma.product.update({
//       where: {
//         id: Number(id),
//       },
//       data: req.body,
//     });
//     res.json(product);
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
