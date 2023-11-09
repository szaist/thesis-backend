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
import { ROLE, User } from '@prisma/client'
import { GetUser } from 'src/auth/decorator'

@Controller('fill')
export class FillingTestController {
    constructor(private fillingTestService: FillingTestService) {}

    // @UseGuards(RolesGuard)
    // @Roles(ROLE.STUDENT)
    // @Get('/test-results/student')
    // async getResultForStudent(@GetUser() user: User) {
    //     return this.fillingTestService.getTestAllResult(user.id)
    // }

    // @UseGuards(RolesGuard)
    // @Roles(ROLE.STUDENT)
    // @Get('/test-results/filled')
    // async getFilledTests(@GetUser() user: User) {
    //     return this.fillingTestService.getFilledTests(user.id)
    // }

    // @UseGuards(RolesGuard)
    // @Roles(ROLE.STUDENT, ROLE.TEACHER)
    // @Get('/filled/:id')
    // async getFilled(@Param('id', ParseIntPipe) id: number) {
    //     return this.fillingTestService.getFilledById(id)
    // }

    // @UseGuards(RolesGuard)
    // @Roles(ROLE.TEACHER)
    // @Get('/test-results/:userId')
    // async getAllTestResult(@Param('userId', ParseIntPipe) userId: number) {
    //     return this.fillingTestService.getTestAllResult(userId)
    // }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Get('filled-tests/teacher/upcomingtest/:upcomingTestId/user/:userId')
    async getStudentAnswersFromTeacherSide(
        @Param('upcomingTestId', ParseIntPipe) upcomingTestId: number,
        @Param('userId', ParseIntPipe) userId: number,
    ) {
        return this.fillingTestService.getAnswersForFilledTest(
            upcomingTestId,
            userId,
        )
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Get('filled-tests/teacher/upcomingtest/:upcomingTestId')
    async getTeacherFilledTestGroupedByUpcomingTest(
        @Param('upcomingTestId', ParseIntPipe) upcomingTestId,
    ) {
        return this.fillingTestService.getFilledTestsByUpcomingTestId(
            upcomingTestId,
        )
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.STUDENT)
    @Get('filled-tests/student/course/:courseId')
    async getStudentFilledTestsByCourseIdAndUserId(
        @Param('courseId', ParseIntPipe) courseId: number,
        @GetUser() user: User,
    ) {
        return this.fillingTestService.getFilledTestsByUserAndCourse(
            courseId,
            user.id,
        )
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.STUDENT)
    @Get('filled-tests/student/upcomingtest/:upcomingTestId')
    async getStudentGivenAnswers(
        @Param('upcomingTestId', ParseIntPipe) upcomingTestId: number,
        @GetUser() user: User,
    ) {
        return this.fillingTestService.getAnswersForFilledTest(
            upcomingTestId,
            user.id,
        )
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER, ROLE.STUDENT)
    @Get('/users/upcomingtest/:upcomingTestId')
    async getUsersWhoFilledTheTest(
        @Param('upcomingTestId', ParseIntPipe) upcomingTestId: number,
    ) {
        return this.fillingTestService.getWhoFilledTheTest(upcomingTestId)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.STUDENT)
    @Post('/answer')
    async answerQuestion(@Body() dto: AnswerQuestion, @GetUser() user: User) {
        return this.fillingTestService.answerQuestion(dto, user.id)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.STUDENT)
    @Post('/start-test')
    async startTest(@Body() dto: StartDto, @GetUser() user: User) {
        return this.fillingTestService.startTest(dto, user.id)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.STUDENT)
    @Post('/end-test/:testId')
    async endTest(@Param('testId', ParseIntPipe) testId: number) {
        return this.fillingTestService.endTest(testId)
    }
}
