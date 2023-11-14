import { Transform, Type } from 'class-transformer'
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
    @IsString()
    id: number

    @Type(() => Number)
    @IsNotEmpty()
    testId: number

    @IsString()
    @IsNotEmpty()
    text: string

    @IsNotEmpty()
    @Type(() => Number)
    @IsString()
    type: QuestionTypes
}
