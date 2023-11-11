import { IsNotEmpty, IsString } from 'class-validator'

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    token: string
}
