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
import { InsertTestDto, UpdateTestDto } from './dto'
import { TestService } from './test.service'
import { GetUser } from 'src/auth/decorator'
import { ROLE, User } from '@prisma/client'
import { RolesGuard } from 'src/auth/guard'
import { Roles } from 'src/auth/decorator/roles.decorator'

@UseGuards(RolesGuard)
@Roles(ROLE.STUDENT, ROLE.TEACHER)
@Controller('test')
export class TestController {
    constructor(private testService: TestService) {}

    @Get('/:id')
    async getTestById(@Param('id', ParseIntPipe) testId: number) {
        return this.testService.getTestById(testId)
    }

    @Get('/owned')
    async getTestByOwnerId(@GetUser() user : User) {
        return this.testService.getTestsByOwnerId(user.id)
    }

    @Get()
    async getAllTest() {
        return this.testService.getAllTest()
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Post()
    async insertTest(@Body() dto: InsertTestDto) {
        return this.testService.insertTest(dto)
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
