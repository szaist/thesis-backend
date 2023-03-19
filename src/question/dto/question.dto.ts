import { IsNotEmpty, IsString, IsNumber } from 'class-validator'

export class InsertQuestionDto {
    @IsNumber()
    @IsNotEmpty()
    testId: number

    @IsString()
    @IsNotEmpty()
    text: string
}
