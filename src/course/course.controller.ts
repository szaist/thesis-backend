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

@Controller('course')
export class CourseController {
    constructor(private courseService: CourseService) {}

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER, ROLE.STUDENT)
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

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER, ROLE.STUDENT)
    @Get('/connected')
    async getUserCourses(@GetUser() user: User) {
        return this.courseService.getUserCourses(user.id)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER, ROLE.STUDENT)
    @Get('/:courseId')
    async getCourseById(@Param('courseId', ParseIntPipe) courseId: number) {
        return this.courseService.getCourseById(courseId)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER, ROLE.STUDENT)
    @Get('/user/in/:courseId')
    async userInCourse(@Param('courseId', ParseIntPipe) courseId: number) {
        return this.courseService.getUsersInCourse(courseId)
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

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
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
    async insertCourse(@Body() dto: InsertCourseDto, @GetUser() user: User) {
        return this.courseService.insertCourse(dto, user.id)
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
