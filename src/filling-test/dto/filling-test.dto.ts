import { IsNotEmpty, IsNumber } from 'class-validator'

export class AnswerQuestion {
    @IsNotEmpty()
    @IsNumber()
    userId: number

    @IsNotEmpty()
    @IsNumber()
    questionId: number

    @IsNotEmpty()
    @IsNumber()
    answerId: number
}

export class StartDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number

    @IsNotEmpty()
    @IsNumber()
    upComingTestId: number
}
