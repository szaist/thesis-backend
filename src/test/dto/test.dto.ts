import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class InsertTestDto {
    @IsNotEmpty()
    @IsNumber()
    ownerId

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
