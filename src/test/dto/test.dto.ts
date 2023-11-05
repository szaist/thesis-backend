import { QuestionTypes } from '@prisma/client'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class InsertTestDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsString()
    @IsOptional()
    description: string
}

export class UpdateTestDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsString()
    @IsOptional()
    description: string
}

export class SaveTestQuestionsDto {
    @IsNotEmpty()
    Questions: {
        text: string
        type: QuestionTypes
        Answers: {
            id: number
            point: number
            text: string
        }[]
    }[]
}
