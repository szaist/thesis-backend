import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator'
import { QuestionTypes } from 'src/enums'

export class InsertQuestionDto {
    @IsNumber()
    @IsNotEmpty()
    testId: number

    @IsString()
    @IsNotEmpty()
    text: string

    @IsEnum(QuestionTypes)
    type: QuestionTypes
}
