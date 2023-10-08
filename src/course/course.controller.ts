import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common'
import { CourseService } from './course.service'
import { InsertCourseDto } from './dto'
import { RolesGuard } from 'src/auth/guard'
import { Roles } from 'src/auth/decorator/roles.decorator'
import { ROLE, User } from '@prisma/client'
import { GetUser } from 'src/auth/decorator'

@UseGuards(RolesGuard)
@Roles(ROLE.TEACHER, ROLE.STUDENT)
@Controller('course')
export class CourseController {
    constructor(private courseService: CourseService) {}

    @Get()
    async getCourses() {
        return this.courseService.getCourses()
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Get('/owned')
    async getOwnedCourses(@GetUser() user: User) {
        return this.courseService.getOwnedCourses(user.id)
    }

    @Get('/:courseId')
    async getCourseById(@Param('courseId', ParseIntPipe) courseId: number) {
        return this.courseService.getCourseById(courseId)
    }

    @Get('/user/in/:courseId')
    async userInCourse(@Param('courseId', ParseIntPipe) courseId: number) {
        return this.courseService.getUsersInCourse(courseId)
    }

    // ? Nem biztos hogy szükség van rá
    @Get('/user/:userId')
    async getUserCourses(@Param('userId', ParseIntPipe) userId: number) {
        return this.courseService.getUserCourses(userId)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
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

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Post()
    async insertCourse(@Body() dto: InsertCourseDto) {
        return this.courseService.insertCourse(dto)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Delete('/:courseId')
    async deleteCourse(@Param('courseId', ParseIntPipe) courseId: number) {
        return this.courseService.deleteCourse(courseId)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Patch('/:courseId')
    async updateCourse(
        @Param('courseId', ParseIntPipe) courseId,
        @Body() dto: InsertCourseDto,
    ) {
        return this.courseService.updateCourse(courseId, dto)
    }
}
