import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class InsertTestDto {
    @IsNotEmpty()
    @IsNumber()
    ownerId

    @IsNotEmpty()
    @IsString()
    title: string

    @IsString()
    description: string
}
