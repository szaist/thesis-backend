import { Injectable } from '@nestjs/common'
import { Prisma, Question } from '@prisma/client'
import { Errors } from 'src/prisma/errors'
import { PrismaService } from 'src/prisma/prisma.service'
import { InsertTestDto, UpdateTestDto } from './dto'

@Injectable()
export class TestService {
    constructor(private prisma: PrismaService) {}

    //Getters
    async getTestById(testId: number) {
        try {
            // const test = await this.prisma.test.findFirstOrThrow({
            //     where: {
            //         id: testId,
            //     },
            // })
            // const question = await this.prisma.question.findMany({
            //     where: {
            //         testId: testId,
            //     },
            // })
            // const questionsWithAnswers = await question.reduce(
            //     async (arr: any, q: Question) => {
            //         const results = await arr
            //         const answers = await this.prisma.answer.findMany({
            //             where: {
            //                 questionId: q.id,
            //             },
            //         })
            //         results.push({
            //             ...q,
            //             answers: [...answers],
            //         })
            //         return results
            //     },
            //     [],
            // )
            // return { ...test, questions: questionsWithAnswers }

            const result = await this.prisma.test.findFirstOrThrow({
                where: {
                    id: testId,
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    Questions: {
                        select: {
                            id: true,
                            text: true,
                            type: true,
                            Answers: {
                                select: {
                                    id: true,
                                    point: true,
                                    text: true,
                                },
                            },
                        },
                    },
                },
            })

            return result
        } catch (error) {
            console.error('getTestById: ', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }

            throw error
        }
    }

    async getTestsByOwnerId(ownerId: number) {
        try {
            const tests = await this.prisma.test.findMany({
                where: {
                    ownerId: ownerId,
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
            })

            return tests
        } catch (error) {
            console.error('getTestsByOwnerId: ', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }

            throw error
        }
    }

    async getTestsByCourseId(courseId: number) {
        try {
            const tests = await this.prisma.upComingTest.findMany({
                where: {
                    courseId,
                },
                select: {
                    test: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            })

            return tests.map((t) => t.test)
        } catch (error) {
            console.error('getTestsByCourseId: ', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }

            throw error
        }
    }

    async getAllTest() {
        try {
            const tests = await this.prisma.test.findMany({})

            return tests
        } catch (error) {
            console.error('GetAllTests: ', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }

            throw error
        }
    }

    // Insert
    async insertTest(dto: InsertTestDto, ownerId: number) {
        try {
            const createdTest = await this.prisma.test.create({
                data: { ...dto, ownerId },
            })

            return createdTest
        } catch (error) {
            console.error('InsertTest: ', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }

            throw error
        }
    }

    //Patch
    async updateTest(testId: number, dto: UpdateTestDto) {
        try {
            const response = await this.prisma.test.update({
                where: {
                    id: testId,
                },
                data: dto,
            })

            return response
        } catch (error) {
            console.error('updateTest: ', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                Errors.codes[error.code]
            }
        }
    }

    // Delete
    async deleteTest(testId: number) {
        try {
            const response = await this.prisma.test.delete({
                where: {
                    id: testId,
                },
            })

            return response
        } catch (error) {
            console.log('deleteTest: ', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
        }
    }
}
