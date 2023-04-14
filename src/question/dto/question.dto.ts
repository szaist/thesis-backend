import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsEnum,
    IsOptional,
} from 'class-validator'
import { QuestionTypes } from 'src/enums'

export class InsertQuestionDto {
    @IsOptional()
    @IsNumber()
    id: number

    @IsNumber()
    @IsNotEmpty()
    testId: number

    @IsString()
    @IsNotEmpty()
    text: string

    @IsEnum(QuestionTypes)
    type: QuestionTypes
}
