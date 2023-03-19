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

    @Patch()
    async updateAnswer(
        @Body('answerId') answerId: number,
        @Body() dto: InsertAnswerDto,
    ) {
        return this.answerService.updateAnswer(answerId, dto)
    }

    @Delete()
    async deleteAnswer(@Body('answerId') answerId: number) {
        return this.answerService.deleteAnswer(answerId)
    }
}
