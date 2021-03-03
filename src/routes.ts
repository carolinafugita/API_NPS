import { Router } from 'express';
import { UserContoller } from './controllers/UserController';
import { SurveyController } from './controllers/SurveyController';
import { SendMailController } from './controllers/SendMailController';
import { AnswerController } from './controllers/AnswerController';
import { NPSController } from './controllers/NPSController';

const router = Router();
const userContoller = new UserContoller();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NPSController();

router.post("/users", userContoller.create);
router.post("/surveys", surveyController.create);
router.get("/surveys",surveyController.show);
router.post("/sendMail",sendMailController.execute);
router.get("/answers/:value",answerController.execute);
router.get("/nps/:survey_id",npsController.execute)

export { router }

