import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Errors } from 'src/prisma/errors'
import { PrismaService } from 'src/prisma/prisma.service'
import { InsertQuestionDto } from './dto'

@Injectable()
export class QuestionService {
    constructor(private prisma: PrismaService) {}

    // Getters
    async getQuestionById(questionId: number) {
        try {
            const question = await this.prisma.question.findFirst({
                where: {
                    id: questionId,
                },
            })

            if (question === null) {
                throw new NotFoundException('Question not found!')
            }

            return {
                question,
            }
        } catch (error) {
            console.error('questionGetById', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
            throw error
        }
    }

    async getQuestionsByTestId(testId: number) {
        try {
            const questions = await this.prisma.question.findMany({
                where: {
                    testId: testId,
                },
            })

            return {
                questions,
            }
        } catch (error) {
            console.error('questionsByTestId', error)
            throw error
        }
    }

    // Insert
    async insertQuestion(dto: InsertQuestionDto) {
        try {
            await this.prisma.question.create({
                data: dto,
            })
        } catch (error) {
            console.error('insertQuestion', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }

            throw error
        }
    }

    // Update
    async updateQuestion(questionId: number, dto: InsertQuestionDto) {
        try {
            const updatedQuestion = await this.prisma.question.update({
                where: {
                    id: questionId,
                },
                data: dto,
            })

            return {
                updatedQuestion,
            }
        } catch (error) {
            console.error('updateQuestion: ', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }

            throw error
        }
    }

    async deleteQuestion(questionId: number) {
        try {
            await this.prisma.question.delete({
                where: {
                    id: questionId,
                },
            })
        } catch (error) {
            console.error('deleteQuestion: ', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }

            throw error
        }
    }
}
