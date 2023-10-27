import { IsNotEmpty, IsNumber } from 'class-validator'

export class AnswerQuestion {
    @IsNotEmpty()
    @IsNumber()
    questionId: number

    @IsNotEmpty()
    @IsNumber()
    upcomingTestId: number

    @IsNotEmpty()
    @IsNumber()
    answerId: number
}

export class StartDto {
    @IsNotEmpty()
    @IsNumber()
    upComingTestId: number
}
