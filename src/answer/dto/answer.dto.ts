import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator'

export class InsertAnswerDto {
    @IsNumber()
    questionId: number

    @IsNotEmpty()
    @IsString()
    text: string

    @IsBoolean()
    correct: boolean

    @IsNumber()
    point: number
}
