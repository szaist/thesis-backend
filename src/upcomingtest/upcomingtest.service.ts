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

            // Get upcoming tests by user course ids

            const upcomingTests = courses.reduce(async (result: any, curr) => {
                const results = await result

                const testByCourseId = await this.prisma.upComingTest.findMany({
                    where: {
                        courseId: curr.courseId,
                    },
                })

                return [...results, ...testByCourseId]
            }, [])

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

    async insertUpcomingTest(dto: InsertUpcomingTestDto) {
        try {
            const response = await this.prisma.upComingTest.create({
                data: dto,
            })

            return {
                data: response,
            }
        } catch (error) {}
    }
}
