import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AnswerQuestion, StartDto } from './dto'
import { Errors } from 'src/prisma/errors'
import { Prisma } from '@prisma/client'

@Injectable()
export class FillingTestService {
    constructor(private prisma: PrismaService) {}

    async answerQuestion(dto: AnswerQuestion, userId: number) {
        try {
            await this.prisma.questionAnswered.create({
                data: { ...dto, userId },
            })
        } catch (error) {
            console.error('answerQuestion', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
            throw error
        }
    }

    async getFilledById(id: number) {
        try {
            return await this.prisma.testFilled.findFirstOrThrow({
                where: {
                    id,
                },
                select: {
                    id: true,
                    startDate: true,
                    endDate: true,
                    submitted: true,
                    upComingTest: true,
                    user: true,
                },
            })
        } catch (error) {}
    }

    async answerMoreQuestion(dto: AnswerQuestion[], userId: number) {
        try {
            await this.prisma.questionAnswered.createMany({
                data: {
                    ...dto.map((m) => ({ ...m, userId })),
                },
            })
        } catch (error) {
            console.error('answerMoreQuestion', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
            throw error
        }
    }

    async startTest(dto: StartDto, userId: number) {
        try {
            const alreadyStarted = await this.prisma.testFilled.findFirst({
                where: {
                    upComingTestId: dto.upComingTestId,
                    userId: userId,
                },
            })

            if (alreadyStarted) throw new BadRequestException()

            const response = await this.prisma.testFilled.create({
                data: { ...dto, userId },
                select: {
                    id: true,
                    startDate: true,
                    upComingTest: true,
                },
            })

            return response
        } catch (error) {
            console.error('startTest', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
            throw error
        }
    }

    async endTest(filledTestId: number) {
        const date = new Date().toJSON()
        try {
            await this.prisma.testFilled.update({
                where: { id: filledTestId },
                data: {
                    endDate: date,
                    submitted: true,
                },
            })
        } catch (error) {
            console.error('endTest', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
            throw error
        }
    }

    async getWhoFilledTheTest(upcomingTestId: number) {
        try {
            const whoFilledUserIds = await this.prisma.testFilled.findMany({
                where: {
                    upComingTestId: upcomingTestId,
                },
                select: {
                    userId: true,
                },
            })

            const users = await whoFilledUserIds.reduce(
                async (results: any, curr) => {
                    const res = await results
                    const user = await this.prisma.user.findFirst({
                        where: {
                            id: curr.userId,
                        },
                        select: {
                            email: true,
                            firstName: true,
                            lastName: true,
                            id: true,
                            role: true,
                        },
                    })

                    res.add(user)

                    return res
                },
                new Set(),
            )

            return Array.from(users)
        } catch (error) {
            console.error('getWhoFilledTheTest', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
            throw error
        }
    }

    async getTestAllResult(userId: number) {
        try {
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
            const data = await allFilledTest.reduce(
                async (results: any, filledTest) => {
                    const res = await results

                    const upcomingTest =
                        await this.prisma.upComingTest.findUnique({
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

                    const questionAnswered =
                        await this.prisma.questionAnswered.findMany({
                            where: {
                                upcomingTestId: upcomingTest.id,
                            },
                        })

                    const answersAndQuestions = await questionAnswered.reduce(
                        async (r1: any, questionA) => {
                            const r1a = await r1
                            const question =
                                await this.prisma.question.findUnique({
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

                            r1a.push({
                                question,
                                selectedAnswer,
                            })
                            return r1a
                        },
                        [],
                    )
                    const userPoints = answersAndQuestions.reduce(
                        (point, curr) => {
                            point += curr.selectedAnswer[0].point
                            console.log(curr)
                            return point
                        },
                        0,
                    )

                    const countedIds = []
                    const maxPoint = await questionAnswered.reduce(
                        async (point: any, curr) => {
                            let p = await point

                            const allAnswer = await this.prisma.answer.findMany(
                                {
                                    where: {
                                        questionId: curr.questionId,
                                    },
                                },
                            )

                            allAnswer.forEach((answer) => {
                                if (countedIds.includes(answer.id)) return

                                p += answer.point
                                countedIds.push(answer.id)
                            })

                            return p
                        },
                        0,
                    )

                    res.push({
                        test,
                        filledTest,
                        upcomingTest,
                        answersAndQuestions,
                        maxPoint,
                        reachedPoints: userPoints,
                    })
                    return res
                },
                [],
            )

            return data
        } catch (error) {
            console.error('getTestAllResult', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
            throw error
        }
    }
}
