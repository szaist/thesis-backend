import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AnswerQuestion, StartDto } from './dto'

@Injectable()
export class FillingTestService {
    constructor(private prisma: PrismaService) {}

    async answerQuestion(dto: AnswerQuestion) {
        try {
            await this.prisma.questionAnswered.create({ data: dto })
        } catch (error) {}
    }

    async startTest(dto: StartDto) {
        try {
            await this.prisma.testFilled.create({
                data: dto,
            })
        } catch (error) {}
    }

    async endTest(filledTestId: number) {
        const date = new Date().toJSON()
        try {
            await this.prisma.testFilled.update({
                where: { id: filledTestId },
                data: {
                    endDate: date,
                },
            })
        } catch (error) {}
    }

    /*

    [{   
        title: ...
        testId: ...

        questions: [{
            questionId: ...,
            text: ...,

        }, ...]
        answers: [{
            answerId: ...,
            text: ...,
        }]
    }]

    */

    async getTestAllResult(userId: number) {
        // Minden teszt amit kitöltött a user
        const allFilledTest = await this.prisma.testFilled.findMany({
            where: {
                userId: userId,
            },
            select: {
                upComingTestId: true,
                submitted: true,
                endDate: true,
            },
        })

        // console.log('allFilledTest: ', allFilledTest)

        // Az egyes tesztekhez lekérjük a leadott válaszokat
        const data = await allFilledTest.reduce(
            async (results: any, filledTest) => {
                const res = await results

                const upcomingTest = await this.prisma.upComingTest.findUnique({
                    where: {
                        id: filledTest.upComingTestId,
                    },
                    select: {
                        id: true,
                        courseId: true,
                        testId: true,
                    },
                })

                const test = await this.prisma.test.findUnique({
                    where: {
                        id: upcomingTest.testId,
                    },
                    select: {
                        title: true,
                        description: true,
                        id: true,
                    },
                })

                // console.log('upcomingTest: ', upcomingTest)

                const questionAnswered =
                    await this.prisma.questionAnswered.findMany({
                        where: {
                            upcomingTestId: upcomingTest.id,
                        },
                    })

                // console.log('questionAnswered: ', questionAnswered)

                const answersAndQuestions = await questionAnswered.reduce(
                    async (r1: any, questionA) => {
                        const r1a = await r1
                        const question = await this.prisma.question.findUnique({
                            where: {
                                id: questionA.questionId,
                            },
                        })

                        const selectedAnswer =
                            await this.prisma.answer.findMany({
                                where: {
                                    id: questionA.answerId,
                                },
                            })

                        const allAnswer = await this.prisma.answer.findMany({
                            where: {
                                questionId: questionA.questionId,
                            },
                        })

                        r1a.push({
                            question,
                            selectedAnswer,
                        })
                        return r1a
                    },
                    [],
                )
                res[upcomingTest.id] = {
                    test,
                    filledTest,
                    upcomingTest,
                    answersAndQuestions,
                }
                return res
            },
            {},
        )
        console.log(data)
        //Kérdésekhez lekérjük mi volt a kérdés, és mi volt a válasz rá

        return {
            data: data,
        }
    }
}
