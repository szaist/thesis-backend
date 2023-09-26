import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common'
import { ParseIntPipe } from '@nestjs/common/pipes'
import { InsertQuestionDto } from './dto'
import { QuestionService } from './question.service'
import { RolesGuard } from 'src/auth/guard'
import { Roles } from 'src/auth/decorator/roles.decorator'
import { ROLE } from '@prisma/client'

@UseGuards(RolesGuard)
@Roles(ROLE.STUDENT, ROLE.TEACHER)
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

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Post()
    async insertQuestion(@Body() dto: InsertQuestionDto) {
        return this.questionService.insertQuestion(dto)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Delete('/:id')
    async deleteQuestion(@Param('id', ParseIntPipe) questionId: number) {
        return this.questionService.deleteQuestion(questionId)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Patch('/:id')
    async updateQuestion(
        @Param('id', ParseIntPipe) questionId,
        @Body() dto: InsertQuestionDto,
    ) {
        return this.questionService.updateQuestion(questionId, dto)
    }
}
