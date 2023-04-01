import { Injectable } from '@nestjs/common'
import { Prisma, UsersToUpComingTests } from '@prisma/client'
import { Errors } from 'src/prisma/errors'
import { PrismaService } from 'src/prisma/prisma.service'
import { InsertUpcomingTestDto } from './dto'

@Injectable()
export class UpcomingtestService {
    constructor(private prisma: PrismaService) {}

    async getUpcomingTestByUserId(userId: number) {
        try {
            const upcomingTestsRelation =
                await this.prisma.usersToUpComingTests.findMany({
                    where: {
                        userId: userId,
                    },
                })

            const upcomingTests = await upcomingTestsRelation.reduce(
                async (arr: any, rel: UsersToUpComingTests) => {
                    const result = await arr
                    const { data } = await this.getUpcomingTestById(
                        rel.upComingTestId,
                    )

                    result.push(data)
                    return result
                },
                [],
            )

            return { data: upcomingTests }
        } catch (error) {
            console.error('getUpcomingTestByUserId: ', error)
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

    async insertUserToUpcomingTest(upComingTestId: number, userId: number[]) {
        try {
            const response = await this.prisma.usersToUpComingTests.createMany({
                data: userId.map((userId) => ({ userId, upComingTestId })),
            })

            return {
                data: response,
            }
        } catch (error) {}
    }
}
