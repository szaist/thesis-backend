import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator'

export class InsertUpcomingTestDto {
    @IsNotEmpty()
    @IsNumber()
    testId: number

    @IsNotEmpty()
    @IsNumber()
    courseId: number

    @IsNotEmpty()
    @IsDateString()
    startDate: Date

    @IsNotEmpty()
    @IsDateString()
    lastStartDate: Date
}
