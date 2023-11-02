import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { Errors } from 'src/prisma/errors'
import { InsertAnswerDto } from './dto'

@Injectable()
export class AnswerService {
    constructor(private prisma: PrismaService) {}

    // Getters
    async getAnswersById(questionId: number) {
        try {
            const answers = await this.prisma.answer.findMany({
                where: {
                    questionId: questionId,
                },
            })

            return answers
        } catch (error) {
            console.error('getAnswersById: ', error)
            throw error
        }
    }

    //Insert
    async insertAnswer(dto: InsertAnswerDto) {
        try {
            const response = await this.prisma.answer.upsert({
                where: { id: dto?.id ? dto.id : -1 },
                update: dto,
                create: dto,
            })
            return response
        } catch (error) {
            console.error('insertAnswer: ', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
            throw error
        }
    }

    // Update
    async updateAnswer(answerId: number, dto: InsertAnswerDto) {
        try {
            const response = await this.prisma.answer.update({
                where: {
                    id: answerId,
                },
                data: dto,
            })

            return response
        } catch (error) {
            console.error('updateAnswer: ', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
            throw error
        }
    }

    // delete
    async deleteAnswer(answerId: number) {
        try {
            const response = await this.prisma.answer.delete({
                where: {
                    id: answerId,
                },
            })

            return response
        } catch (error) {
            console.error('deleteAnswer: ', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
            throw error
        }
    }
}
