import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Errors } from 'src/prisma/errors'
import { PrismaService } from 'src/prisma/prisma.service'
import { InsertTestDto } from './dto'

@Injectable()
export class TestService {
    constructor(private prisma: PrismaService) {}

    //Getters
    async getTestById(testId: number) {
        try {
            const test = await this.prisma.test.findFirstOrThrow({
                where: {
                    id: testId,
                },
            })

            return {
                test,
            }
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
            })

            return { tests }
        } catch (error) {
            console.error('getTestsByOwnerId: ', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }

            throw error
        }
    }

    async getAllTest() {
        try {
            const tests = await this.prisma.test.findMany({})

            return {
                tests,
            }
        } catch (error) {
            console.error('GetAllTests: ', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }

            throw error
        }
    }

    // Insert
    async insertTest(dto: InsertTestDto) {
        try {
            const createdTest = await this.prisma.test.create({
                data: dto,
            })

            return {
                createdTest,
            }
        } catch (error) {
            console.error('InsertTest: ', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }

            throw error
        }
    }

    //Patch
    async updateTest(testId: number, dto: InsertTestDto) {
        try {
            await this.prisma.test.update({
                where: {
                    id: testId,
                },
                data: dto,
            })
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
            await this.prisma.test.delete({
                where: {
                    id: testId,
                },
            })
        } catch (error) {
            console.log('deleteTest: ', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
        }
    }
}
