import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AnswerQuestion, StartDto } from './dto'

@Injectable()
export class FillingTestService {
    constructor(private prisma: PrismaService) {}

    async answerQuestion(dto: AnswerQuestion) {
        try {
            await this.prisma.questionAnswered.create({ data: dto })
        } catch (error) {}
    }

    async startTest(dto: StartDto) {
        try {
            await this.prisma.testFilled.create({
                data: dto,
            })
        } catch (error) {}
    }

    async endTest(filledTestId: number) {
        const date = new Date().toJSON()
        try {
            await this.prisma.testFilled.update({
                where: { id: filledTestId },
                data: {
                    endDate: date,
                },
            })
        } catch (error) {}
    }
}
