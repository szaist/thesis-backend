import { IsNotEmpty, IsNumber, IsDate, IsDateString } from 'class-validator'

export class InsertUpcomingTestDto {
    @IsNotEmpty()
    @IsNumber()
    testId: number

    @IsNotEmpty()
    @IsDateString()
    startDate: Date

    @IsNotEmpty()
    @IsDateString()
    lastStartDate: Date
}
