import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { InsertCourseDto, InsertUserToCourse } from './dto'

@Injectable()
export class CourseService {
    constructor(private prisma: PrismaService) {}

    async getCourses() {
        try {
            const courses = await this.prisma.course.findMany({})

            return {
                data: courses,
            }
        } catch (error) {}
    }

    async getCourseById(courseId: number) {
        try {
            const course = await this.prisma.course.findFirstOrThrow({
                where: {
                    id: courseId,
                },
            })
            return {
                data: course,
            }
        } catch (error) {}
    }

    async getOwnedCourses(ownerId: number) {
        try {
            const owned = await this.prisma.course.findMany({
                where: {
                    ownerId: ownerId,
                },
            })

            return {
                data: owned,
            }
        } catch (error) {}
    }

    async getUserCourses(userId: number) {
        try {
            const courses = await this.prisma.course.findMany({})

            const userCourseConnections =
                await this.prisma.courseToUser.findMany({
                    where: {
                        userId: userId,
                    },
                })

            const userCourses = userCourseConnections.map((con) => {
                return courses.find((c) => con.courseId === c.id)
            })

            return { data: userCourses }
        } catch (error) {}
    }

    async addUserToCourse(courseId: number, userId: number) {
        try {
            await this.prisma.courseToUser.create({
                data: {
                    userId,
                    courseId,
                },
            })
        } catch (error) {}
    }
    async deleteUserFromCourse(courseId: number, userId: number) {
        try {
            await this.prisma.courseToUser.deleteMany({
                where: {
                    userId: userId,
                    courseId: courseId,
                },
            })
        } catch (error) {}
    }

    async insertCourse(dto: InsertCourseDto) {
        try {
            const response = await this.prisma.course.create({
                data: dto,
            })

            return {
                data: response,
            }
        } catch (error) {}
    }

    async deleteCourse(courseId: number) {
        try {
            await this.prisma.course.delete({
                where: {
                    id: courseId,
                },
            })
        } catch (error) {}
    }

    async updateCourse(courseId: number, dto: InsertCourseDto) {
        try {
            await this.prisma.course.update({
                where: {
                    id: courseId,
                },
                data: dto,
            })
        } catch (error) {}
    }
}
