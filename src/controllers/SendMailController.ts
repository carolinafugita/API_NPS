import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import sendMailService from "../services/sendMailService";
import { resolve } from 'path';


class SendMailController {

    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository)
        const surveysRepository = getCustomRepository(SurveysRepository)
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        const user = await usersRepository.findOne({ email })

        if(!user) {
            return response.status(400).json({
                error: "User doesn't exist."
            })
        }

        const survey = await surveysRepository.findOne({ id: survey_id })

        if(!survey){
            return response.status(400).json({
                error: "Survey doesn't exist."
            })  
        }

        const npsPath = resolve(__dirname,"..","views","emails","npsMail.hbs")

        

        const userSurveyAlreadyExistsUnanswered = await surveysUsersRepository.findOne({
            user_id: user.id, survey_id: survey_id, value: null
        })

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }

        if(userSurveyAlreadyExistsUnanswered){

            variables.id = userSurveyAlreadyExistsUnanswered.id;
            await sendMailService.execute(
                email,
                survey.description,
                variables,
                npsPath
            );

            return response.json(userSurveyAlreadyExistsUnanswered)
        }

        const userSurvey = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        })


        await surveysUsersRepository.save(userSurvey)
        variables.id = userSurvey.id;

        await sendMailService.execute(
            email,
            survey.description,
            variables,
            npsPath
        );

        return response.json(userSurvey)
    }
}

export { SendMailController }