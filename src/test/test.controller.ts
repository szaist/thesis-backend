import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common'
import { ParseIntPipe } from '@nestjs/common/pipes'
import { InsertTestDto, UpdateTestDto } from './dto'
import { TestService } from './test.service'

@Controller('test')
export class TestController {
    constructor(private testService: TestService) {}

    @Get('/:id')
    async getTestById(@Param('id', ParseIntPipe) testId: number) {
        return this.testService.getTestById(testId)
    }

    @Get('/owner/:id')
    async getTestByOwnerId(@Param('id', ParseIntPipe) ownerId: number) {
        return this.testService.getTestsByOwnerId(ownerId)
    }

    @Get()
    async getAllTest() {
        return this.testService.getAllTest()
    }

    @Post()
    async insertTest(@Body() dto: InsertTestDto) {
        return this.testService.insertTest(dto)
    }

    @Patch('/:id')
    async updateTest(
        @Param('id', ParseIntPipe) testId,
        @Body() dto: UpdateTestDto,
    ) {
        return this.testService.updateTest(testId, dto)
    }

    @Delete('/:id')
    async deleteTest(@Param('id', ParseIntPipe) testId: number) {
        return this.testService.deleteTest(testId)
    }
}
