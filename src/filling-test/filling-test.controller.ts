import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common'
import { FillingTestService } from './filling-test.service'
import { AnswerQuestion, StartDto } from './dto'

@Controller('fill')
export class FillingTestController {
    constructor(private fillingTestService: FillingTestService) {}

    @Post('/answer')
    async answerQuestion(@Body() dto: AnswerQuestion) {
        return this.fillingTestService.answerQuestion(dto)
    }

    @Post('/start-test')
    async startTest(@Body() dto: StartDto) {
        return this.fillingTestService.startTest(dto)
    }

    @Post('/end-test')
    async endTest(@Param('testId', ParseIntPipe) testId: number) {
        return this.fillingTestService.endTest(testId)
    }
}
