import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common'
import { ParseIntPipe } from '@nestjs/common/pipes'
import { InsertQuestionDto } from './dto'
import { QuestionService } from './question.service'

@Controller('question')
export class QuestionController {
    constructor(private questionService: QuestionService) {}
    @Get('/test/:id')
    async getQuestionByTest(@Param('id', ParseIntPipe) testId) {
        return this.questionService.getQuestionsByTestId(testId)
    }

    @Get('/:id')
    async getQuestion(@Param('id', ParseIntPipe) questionId) {
        return this.questionService.getQuestionById(questionId)
    }

    @Post()
    async insertQuestion(@Body() dto: InsertQuestionDto) {
        return this.questionService.insertQuestion(dto)
    }

    @Delete('/:id')
    async deleteQuestion(@Param('id', ParseIntPipe) questionId: number) {
        return this.questionService.deleteQuestion(questionId)
    }

    @Patch('/:id')
    async updateQuestion(
        @Param('id', ParseIntPipe) questionId,
        @Body() dto: InsertQuestionDto,
    ) {
        return this.questionService.updateQuestion(questionId, dto)
    }
}
