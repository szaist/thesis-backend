import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Patch,
    HttpCode,
    HttpStatus,
    Delete,
} from '@nestjs/common'
import { AnswerService } from './answer.service'
import { InsertAnswerDto } from './dto'

@Controller('answer')
export class AnswerController {
    constructor(private answerService: AnswerService) {}

    @Get()
    async getAnswersByQuestionId(@Param('questionId') questionId: number) {
        return this.answerService.getAnswersById(questionId)
    }

    @HttpCode(HttpStatus.CREATED)
    @Post()
    async insertAnswer(@Body() dto: InsertAnswerDto) {
        return this.answerService.insertAnswer(dto)
    }

    @Patch('/:id')
    async updateAnswer(
        @Param('id') answerId: number,
        @Body() dto: InsertAnswerDto,
    ) {
        return this.answerService.updateAnswer(answerId, dto)
    }

    @Delete('/:id')
    async deleteAnswer(@Param('id') answerId: number) {
        return this.answerService.deleteAnswer(answerId)
    }
}
