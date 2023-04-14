import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common'
import { CourseService } from './course.service'
import { InsertCourseDto } from './dto'

@Controller('course')
export class CourseController {
    constructor(private courseService: CourseService) {}

    @Get()
    async getCourses() {
        return this.courseService.getCourses()
    }

    @Get('/owned/:ownerId')
    async getOwnedCourses(@Param('ownerId', ParseIntPipe) ownerId: number) {
        return this.courseService.getOwnedCourses(ownerId)
    }

    @Get('/:courseId')
    async getCourseById(@Param('courseId', ParseIntPipe) courseId: number) {
        return this.courseService.getCourseById(courseId)
    }

    @Get('/user/:userId')
    async getUserCourses(@Param('userId', ParseIntPipe) userId: number) {
        return this.courseService.getUserCourses(userId)
    }

    @Post('/:courseId/user/:userId')
    async addUserToCourse(
        @Param('courseId', ParseIntPipe) courseId: number,
        @Param('userId', ParseIntPipe) userId: number,
    ) {
        return this.courseService.addUserToCourse(courseId, userId)
    }

    @Delete('/:courseId/user/:userId')
    async deleteUserFromCourse(
        @Param('courseId', ParseIntPipe) courseId: number,
        @Param('userId', ParseIntPipe) userId: number,
    ) {
        return this.courseService.deleteUserFromCourse(courseId, userId)
    }

    @Post()
    async insertCourse(@Body() dto: InsertCourseDto) {
        return this.courseService.insertCourse(dto)
    }

    @Delete('/:courseId')
    async deleteCourse(@Param('courseId', ParseIntPipe) courseId: number) {
        return this.courseService.deleteCourse(courseId)
    }

    @Patch('/:courseId')
    async updateCourse(
        @Param('courseId', ParseIntPipe) courseId,
        @Body() dto: InsertCourseDto,
    ) {
        return this.courseService.updateCourse(courseId, dto)
    }
}
