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
import { InsertTestDto, SaveTestQuestionsDto, UpdateTestDto } from './dto'
import { TestService } from './test.service'
import { GetUser } from 'src/auth/decorator'
import { ROLE, User } from '@prisma/client'
import { RolesGuard } from 'src/auth/guard'
import { Roles } from 'src/auth/decorator/roles.decorator'

@Controller('test')
export class TestController {
    constructor(private testService: TestService) {}

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER, ROLE.TEACHER)
    @Get('/owned')
    async getTestByOwnerId(@GetUser() user: User) {
        return this.testService.getTestsByOwnerId(user.id)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.STUDENT, ROLE.TEACHER)
    @Get('/:id')
    async getTestById(
        @Param('id', ParseIntPipe) testId: number,
        @GetUser() user: User,
    ) {
        return this.testService.getTestById(testId, user.role === ROLE.STUDENT)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.STUDENT, ROLE.TEACHER)
    @Get('/course/:courseId')
    async getTestByCourseId(@Param('courseId', ParseIntPipe) courseId: number) {
        return this.testService.getTestsByCourseId(courseId)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.STUDENT, ROLE.TEACHER)
    @Get()
    async getAllTest() {
        return this.testService.getAllTest()
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Post()
    async insertTest(@Body() dto: InsertTestDto, @GetUser() user: User) {
        return this.testService.insertTest(dto, user.id)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Post('/save/:id')
    async saveTestWithQuestions(
        @Param('id', ParseIntPipe) testId,
        @Body() dto: SaveTestQuestionsDto,
    ) {
        return await this.testService.saveTestQuestions(testId, dto)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Patch('/:id')
    async updateTest(
        @Param('id', ParseIntPipe) testId,
        @Body() dto: UpdateTestDto,
    ) {
        return this.testService.updateTest(testId, dto)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Delete('/:id')
    async deleteTest(@Param('id', ParseIntPipe) testId: number) {
        return this.testService.deleteTest(testId)
    }
}
