import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsEnum,
    IsOptional,
} from 'class-validator'
import {
    HasMimeType,
    IsFile,
    MaxFileSize,
    MemoryStoredFile,
} from 'nestjs-form-data'
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

    @IsOptional()
    @IsFile()
    @MaxFileSize(1e6)
    @HasMimeType(['image/jpeg', 'image/png'])
    image: MemoryStoredFile
}
