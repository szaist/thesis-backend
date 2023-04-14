import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsBoolean,
    IsOptional,
} from 'class-validator'

export class InsertAnswerDto {
    @IsOptional()
    @IsNumber()
    id: number

    @IsNumber()
    questionId: number

    @IsNotEmpty()
    @IsString()
    text: string

    @IsNumber()
    point: number
}
