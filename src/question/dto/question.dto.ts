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
    id: string

    @IsNotEmpty()
    testId: string

    @IsString()
    @IsNotEmpty()
    text: string

    @IsString()
    type: string
}
