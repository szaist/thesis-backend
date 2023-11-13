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
    // All test result
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

    async getFilledTestsByUpcomingTestIdFilteredByUserId(
        upcomingTestId: number,
        userId: number,
    ) {
        const filled = await this.getFilledTestsByUpcomingTestId(upcomingTestId)

        return filled.filter((f) => f.user.id === userId)[0]
    }

    async getFilledTestsByUpcomingTestId(upcomingTestId: number) {
        // Az adott kiírt tesztet ki töltötte ki
        const filledTests = await this.prisma.testFilled.findMany({
            where: {
                upComingTestId: upcomingTestId,
            },
            select: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                id: true,
                submitted: true,
                upComingTest: {
                    select: {
                        course: true,
                        testId: true,
                        test: true,
                    },
                },
            },
        })

        const res = filledTests.reduce(async (memo: any, v) => {
            const result = await memo

            const reachedPoints = await this.getReachedPoints(
                upcomingTestId,
                v.user.id,
            )
            const maxPoints = await this.getTestMaxPoint(v.upComingTest.testId)

            const finalObject = { ...v, maxPoints, reachedPoints }

            return [...result, finalObject]
        }, [])

        return res
    }

    //Get user filled tests in the course
    async getFilledTestsByUserAndCourse(courseId: number, userId: number) {
        const filledTestByUser = await this.getFilledTestsByUser(userId)

        return await Promise.all(
            filledTestByUser.filter((t) => {
                return t.upComingTest.course.id == courseId
            }),
        )
    }

    //Whats test user filled
    async getFilledTestsByUser(userId: number) {
        const filledTests = await this.prisma.testFilled.findMany({
            where: {
                userId,
            },
            select: {
                startDate: true,
                endDate: true,
                submitted: true,
                upComingTest: {
                    select: {
                        id: true,
                        course: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                            },
                        },
                        test: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                            },
                        },
                    },
                },
            },
        })

        const res = filledTests.reduce(async (memo: any, vers) => {
            const results = await memo
            const v = await vers

            const maxPoints = await this.getTestMaxPoint(v.upComingTest.test.id)
            const reachedPoints = await this.getReachedPoints(
                v.upComingTest.id,
                userId,
            )

            const value = { ...v, maxPoints, reachedPoints }

            return [...results, value]
        }, [])

        return res
    }

    async getAnswersForFilledTest(upcomingTestId: number, userId: number) {
        const answers = await this.prisma.questionAnswered.findMany({
            where: {
                userId: userId,
                upcomingTestId: upcomingTestId,
            },
            select: {
                question: {
                    select: {
                        id: true,
                        text: true,
                        type: true,
                    },
                },
                answer: {
                    select: {
                        id: true,
                        text: true,
                        point: true,
                    },
                },
            },
        })

        const groupedByUpcomingTest = []

        answers.forEach((a) => {
            const index = groupedByUpcomingTest.findIndex(
                (g) => g?.id === a.question.id,
            )

            if (index === -1) {
                groupedByUpcomingTest.push({
                    ...a.question,
                    answers: [a.answer],
                })
            } else {
                groupedByUpcomingTest[index].answers.push(a.answer)
            }
        })

        return groupedByUpcomingTest
    }

    async getTestMaxPoint(testId: number) {
        const questions = await this.prisma.test.findFirstOrThrow({
            where: {
                id: testId,
            },
            select: {
                Questions: {
                    select: {
                        Answers: {
                            select: {
                                point: true,
                            },
                        },
                    },
                },
            },
        })
        let maxPoints = 0
        questions.Questions.forEach((q) => {
            q.Answers.forEach((a) => {
                maxPoints += a.point
            })
        })

        return maxPoints
    }

    async getReachedPoints(upcomingTestId: number, userId: number) {
        let reachedPoints = 0

        const questions = await this.getAnswersForFilledTest(
            upcomingTestId,
            userId,
        )

        questions.forEach((q) => {
            q.answers.forEach((a) => {
                reachedPoints += a.point
            })
        })

        return reachedPoints
    }
}
