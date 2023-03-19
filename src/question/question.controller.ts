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
    @Get()
    async getQuestion(
        @Param('questionId') questionId,
        @Param('testId') testId,
    ) {
        if (questionId) return this.questionService.getQuestionById(questionId)
        else return this.questionService.getQuestionsByTestId(testId)
    }

    @Post()
    async insertQuestion(@Body() dto: InsertQuestionDto) {
        return this.questionService.insertQuestion(dto)
    }

    @Delete()
    async deleteQuestion(@Body('questionId') questionId: number) {
        return this.questionService.deleteQuestion(questionId)
    }

    @Patch()
    async updateQuestion(
        @Body('questionId') questionId,
        @Body() dto: InsertQuestionDto,
    ) {
        return this.updateQuestion(questionId, dto)
    }
}
