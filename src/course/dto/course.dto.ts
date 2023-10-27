import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator'

export class InsertCourseDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    description: string
}

export class InsertUserToCourse {
    @IsNotEmpty()
    @IsNumber()
    userId: number

    @IsNotEmpty()
    @IsNumber()
    courseId: number
}
