import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common'
import { FillingTestService } from './filling-test.service'
import { AnswerQuestion, StartDto } from './dto'
import { RolesGuard } from 'src/auth/guard'
import { Roles } from 'src/auth/decorator/roles.decorator'
import { ROLE } from '@prisma/client'

@UseGuards(RolesGuard)
@Roles(ROLE.TEACHER, ROLE.STUDENT)
@Controller('fill')
export class FillingTestController {
    constructor(private fillingTestService: FillingTestService) {}

    @Get('/test-results/:userId')
    async getAllTestResult(@Param('userId', ParseIntPipe) userId: number) {
        return this.fillingTestService.getTestAllResult(userId)
    }

    @Get('/users/upcomingtest/:upcomingTestId')
    async getUsersWhoFilledTheTest(
        @Param('upcomingTestId', ParseIntPipe) upcomingTestId: number,
    ) {
        return this.fillingTestService.getWhoFilledTheTest(upcomingTestId)
    }

    @Post('/answer')
    async answerQuestion(@Body() dto: AnswerQuestion) {
        return this.fillingTestService.answerQuestion(dto)
    }

    @Post('/start-test')
    async startTest(@Body() dto: StartDto) {
        return this.fillingTestService.startTest(dto)
    }

    @Post('/end-test/:testId')
    async endTest(@Param('testId', ParseIntPipe) testId: number) {
        return this.fillingTestService.endTest(testId)
    }
}
