import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator'

export class InsertAnswerDto {
    @IsNumber()
    @IsNotEmpty()
    questionId: number

    @IsNotEmpty()
    @IsString()
    text: string

    @IsBoolean()
    correct: boolean
}
