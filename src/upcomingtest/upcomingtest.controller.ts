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
    @Get('/:userId')
    async getUpcomingTests(@Param('userId', ParseIntPipe) userid: number) {
        return this.upcomingtestService.getUpcomingTestByUserId(userid)
    }

    @Post('')
    async insertUpcomingTest(@Body() upcomingTestId: InsertUpcomingTestDto) {
        return this.upcomingtestService.insertUpcomingTest(upcomingTestId)
    }

    @Post('/:upcomingTestId')
    async insertUserToUpcomingPost(
        @Param('upcomingTestId', ParseIntPipe) upcomingTestId,
        @Body('userIds') userIds,
    ) {
        return this.upcomingtestService.insertUserToUpcomingTest(
            upcomingTestId,
            userIds,
        )
    }
}
