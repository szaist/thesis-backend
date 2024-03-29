import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, QuestionTypes } from '@prisma/client'
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

            const answers = await this.prisma.answer.findMany({
                where: {
                    questionId: questionId,
                },
            })

            return { ...question, answers }
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

            return questions
        } catch (error) {
            console.error('questionsByTestId', error)
            throw error
        }
    }

    // Insert
    async insertQuestion(dto: InsertQuestionDto) {
        const questionTypeStrings = Object.keys(QuestionTypes)

        try {
            const response = await this.prisma.question.upsert({
                where: { id: dto.id },
                update: {
                    ...dto,
                    id: dto.id,
                    testId: dto.testId,
                    type: questionTypeStrings[dto.type] as QuestionTypes,
                },
                create: {
                    testId: dto.testId,
                    text: dto.text,
                    type: questionTypeStrings[dto.type] as QuestionTypes,
                },
            })

            return await this.prisma.question.findFirstOrThrow({
                where: {
                    id: response.id,
                },
                include: {
                    QuestionImage: true,
                },
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
            const questionTypeStrings = Object.keys(QuestionTypes)
            const updatedQuestion = await this.prisma.question.update({
                where: {
                    id: questionId,
                },
                data: {
                    ...dto,
                    testId: Number(dto.testId),
                    id: Number(dto.id),
                    type: questionTypeStrings[dto.type] as QuestionTypes,
                },
            })
            return updatedQuestion
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
            const response = await this.prisma.question.delete({
                where: {
                    id: questionId,
                },
            })

            return response
        } catch (error) {
            console.error('deleteQuestion: ', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }

            throw error
        }
    }

    async upsertQuestionImage(
        source: string,
        questionId: number,
        userId: number,
    ) {
        try {
            const response = await this.prisma.questionImage.upsert({
                where: {
                    questionId: questionId,
                },
                create: {
                    source: source,
                    ownerId: userId,
                    questionId: questionId,
                },
                update: {
                    source,
                },
            })

            return response
        } catch (error) {
            console.log('Error during upsert image', error)
        }
    }
}
