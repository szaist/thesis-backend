import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common'
import { InsertQuestionDto } from './dto'
import { QuestionService } from './question.service'

@Controller('question')
export class QuestionController {
    constructor(private questionService: QuestionService) {}
    @Get('/test/:id')
    async getQuestionByTest(@Param('id') testId) {
        return this.questionService.getQuestionsByTestId(testId)
    }

    @Get('/:id')
    async getQuestion(@Param('id') questionId) {
        return this.questionService.getQuestionById(questionId)
    }

    @Post()
    async insertQuestion(@Body() dto: InsertQuestionDto) {
        return this.questionService.insertQuestion(dto)
    }

    @Delete('/:id')
    async deleteQuestion(@Param('id') questionId: number) {
        return this.questionService.deleteQuestion(questionId)
    }

    @Patch('/:id')
    async updateQuestion(
        @Param('id') questionId,
        @Body() dto: InsertQuestionDto,
    ) {
        return this.updateQuestion(questionId, dto)
    }
}
