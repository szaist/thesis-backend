import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsNumber,
    IsEnum,
} from 'class-validator'
import { QuestionTypes } from 'src/enums'

export class InsertQuestionDto {
    @IsOptional()
    @IsNumber()
    id: number

    @IsNotEmpty()
    @IsNumber()
    testId: number

    @IsNotEmpty()
    @IsString()
    text: string

    @IsNotEmpty()
    @IsEnum(QuestionTypes)
    type: QuestionTypes
}
