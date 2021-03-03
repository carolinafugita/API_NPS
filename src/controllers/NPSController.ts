import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull} from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class NPSController {
    async execute (request: Request, response: Response){

        const { survey_id } = request.params;
        const surveyUserRespository = getCustomRepository(SurveysUsersRepository);

        const surveysUser = await surveyUserRespository.find({
            survey_id,
            value: Not(IsNull())
        })

        const detractor =  surveysUser.filter( (survey) => 
            survey.value >= 0 && survey.value <= 6
        ).length;

        const promoter =  surveysUser.filter( (survey) => 
            survey.value >= 9 && survey.value <= 10
        ).length;

        const passive =  surveysUser.filter( (survey) => 
            survey.value >= 7 && survey.value <= 8
        ).length;

        const totalAnswers = surveysUser.length;

        const calculate = Number(
            (((promoter - detractor) / totalAnswers) *100)
            .toFixed(2));

        return response.json({
            detractors: detractor,
            promoters: promoter,
            passive: passive,
            totalAnswers : totalAnswers,
            NPS: calculate
        })
    }
}

export { NPSController }