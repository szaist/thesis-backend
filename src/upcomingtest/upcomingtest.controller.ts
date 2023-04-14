import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
} from '@nestjs/common'
import { InsertUpcomingTestDto } from './dto'
import { UpcomingtestService } from './upcomingtest.service'

@Controller('upcomingtest')
export class UpcomingtestController {
    constructor(private upcomingtestService: UpcomingtestService) {}

    // Getters
    @Get('/user/:userId')
    async getUpcomingTests(@Param('userId', ParseIntPipe) userid: number) {
        return this.upcomingtestService.getUpcomingTestsByUserId(userid)
    }

    @Get('/:upcomingTestId')
    async getUpcomingTestById(
        @Param('upcomingTestId', ParseIntPipe) upcomingTestId: number,
    ) {
        return this.upcomingtestService.getUpcomingTestById(upcomingTestId)
    }

    @Get('/course/:courseId')
    async getUpComingTestsByCourseId(
        @Param('courseId', ParseIntPipe) courseId: number,
    ) {
        return this.upcomingtestService.getUpcomingTestsByCourseId(courseId)
    }

    @Post()
    async insertUpcomingTest(@Body() upcomingTestId: InsertUpcomingTestDto) {
        return this.upcomingtestService.insertUpcomingTest(upcomingTestId)
    }
}
