import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Errors } from 'src/prisma/errors'
import { PrismaService } from 'src/prisma/prisma.service'
import { InsertUpcomingTestDto } from './dto'

@Injectable()
export class UpcomingtestService {
    constructor(private prisma: PrismaService) {}

    async getUpcomingTestsByUserId(userId: number) {
        try {
            // Get user courses
            const courses = await this.prisma.courseToUser.findMany({
                where: {
                    userId: userId,
                },
            })

            const upcomingTests = await courses.reduce(
                async (result: any, curr) => {
                    const results = await result

                    const testByCourseId =
                        await this.prisma.upComingTest.findMany({
                            where: {
                                courseId: curr.courseId,
                            },
                        })

                    const detailedTest = await testByCourseId.reduce(
                        async (result: any, curr) => {
                            const r = await result
                            const testData = await this.prisma.test.findFirst({
                                where: {
                                    id: curr.testId,
                                },
                            })

                            r.push({
                                ...testData,
                                ...curr,
                            })

                            return r
                        },
                        [],
                    )

                    results[curr.courseId] = detailedTest

                    return results
                },
                {},
            )

            return {
                data: upcomingTests,
            }
        } catch (error) {
            console.error('getUpcomingTestsByUserId: ', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }

            throw error
        }
    }

    async getUpcomingTestByOwnerId(ownerId: number) {
        try {
            return await this.prisma.upComingTest.findMany({
                where: {
                    ownerId: ownerId,
                },
            })
        } catch (error) {}
    }

    async getUpcomingTestsByCourseId(courseId: number) {
        try {
            const upcomingTests = await this.prisma.upComingTest.findMany({
                where: {
                    courseId: courseId,
                },
            })

            return {
                data: upcomingTests,
            }
        } catch (error) {
            console.error('getUpcomingTestsByCourseId: ', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }

            throw error
        }
    }

    async getUpcomingTestById(id: number) {
        try {
            const comingTest = await this.prisma.upComingTest.findUnique({
                where: {
                    id: id,
                },
            })

            return {
                data: comingTest,
            }
        } catch (error) {
            console.error('getUpcomingTestById: ', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }

            throw error
        }
    }

    async insertUpcomingTest(dto: InsertUpcomingTestDto, ownerId: number) {
        try {
            const response = await this.prisma.upComingTest.create({
                data: { ...dto, ownerId },
            })

            return {
                data: response,
            }
        } catch (error) {
            console.error('insertUpcomingTest: ', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
        }
    }

    async deleteUpcomingTest(upcomingTestId: number) {
        try {
            await this.prisma.upComingTest.delete({
                where: {
                    id: upcomingTestId,
                },
            })
        } catch (error) {}
    }
}
