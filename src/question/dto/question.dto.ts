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
    @IsString()
    id: number

    @IsNumber()
    @IsNotEmpty()
    testId: number

    @IsString()
    @IsNotEmpty()
    text: string

    @IsNotEmpty()
    @IsEnum(QuestionTypes)
    type: QuestionTypes
}
