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
    UseGuards,
} from '@nestjs/common'
import { AnswerService } from './answer.service'
import { InsertAnswerDto } from './dto'
import { ParseIntPipe } from '@nestjs/common/pipes'
import { RolesGuard } from 'src/auth/guard'
import { ROLE } from '@prisma/client'
import { Roles } from 'src/auth/decorator/roles.decorator'

@UseGuards(RolesGuard)
@Roles(ROLE.TEACHER, ROLE.STUDENT)
@Controller('answer')
export class AnswerController {
    constructor(private answerService: AnswerService) {}

    @Get('/:id')
    async getAnswersByQuestionId(
        @Param('id', ParseIntPipe) questionId: number,
    ) {
        return this.answerService.getAnswersById(questionId)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async insertAnswer(@Body() dto: InsertAnswerDto) {
        return this.answerService.insertAnswer(dto)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Patch('/:id')
    async updateAnswer(
        @Param('id', ParseIntPipe) answerId: number,
        @Body() dto: InsertAnswerDto,
    ) {
        return this.answerService.updateAnswer(answerId, dto)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Delete('/:id')
    async deleteAnswer(@Param('id', ParseIntPipe) answerId: number) {
        return this.answerService.deleteAnswer(answerId)
    }
}
