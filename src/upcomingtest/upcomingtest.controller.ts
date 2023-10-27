import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common'
import { InsertUpcomingTestDto } from './dto'
import { UpcomingtestService } from './upcomingtest.service'
import { RolesGuard } from 'src/auth/guard/roles.guard'
import { Roles } from 'src/auth/decorator/roles.decorator'
import { ROLE, User } from '@prisma/client'
import { GetUser } from 'src/auth/decorator'

@Controller('upcomingtest')
export class UpcomingtestController {
    constructor(private upcomingtestService: UpcomingtestService) {}

    @UseGuards(RolesGuard)
    @Roles(ROLE.STUDENT)
    @Get()
    async getUpcomingTests(@GetUser() user: User) {
        return this.upcomingtestService.getUpcomingTestsByUserId(user.id)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Get('/owned')
    async getUpcomingTestsByOwnerId(@GetUser() user: User) {
        return this.upcomingtestService.getUpcomingTestByOwnerId(user.id)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER, ROLE.STUDENT)
    @Get('/:upcomingTestId')
    async getUpcomingTestById(
        @Param('upcomingTestId', ParseIntPipe) upcomingTestId: number,
    ) {
        return this.upcomingtestService.getUpcomingTestById(upcomingTestId)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER, ROLE.STUDENT)
    @Get('/course/:courseId')
    async getUpComingTestsByCourseId(
        @Param('courseId', ParseIntPipe) courseId: number,
    ) {
        return this.upcomingtestService.getUpcomingTestsByCourseId(courseId)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Post()
    async insertUpcomingTest(
        @Body() upcomingTestId: InsertUpcomingTestDto,
        @GetUser() user: User,
    ) {
        return this.upcomingtestService.insertUpcomingTest(
            upcomingTestId,
            user.id,
        )
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Delete('/:id')
    async deleteUpcomingTest(
        @Param('id', ParseIntPipe) upcomingTestId: number,
    ) {
        return this.upcomingtestService.deleteUpcomingTest(upcomingTestId)
    }
}
