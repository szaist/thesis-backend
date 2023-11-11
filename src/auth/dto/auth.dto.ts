import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator'

export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsOptional()
    firstName: string

    @IsOptional()
    lastName: string
}
