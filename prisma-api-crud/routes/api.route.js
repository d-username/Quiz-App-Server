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

// router.get('/quiz/:id', async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const quiz = await prisma.quiz.findUnique({
//       where: {
//         id: Number(id),
//       },
//     });
//     res.json(quiz);
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

// router.patch('/quiz/:id', async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const quiz = await prisma.quiz.update({
//       where: {
//         id: Number(id),
//       },
//       data: req.body,
//     });
//     res.json(quiz);
//   } catch (error) {
//     next(error);
//   }
// });

router.post('/user', async (req, res, next) => {
  const data = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });

    res.json(newUser);
  } catch (error) {
    next(error);
  }
});

router.get('/user/:email', async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
