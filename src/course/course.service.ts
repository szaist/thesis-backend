import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { InsertCourseDto } from './dto'
import { Errors } from 'src/prisma/errors'
import { Prisma } from '@prisma/client'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class CourseService {
    constructor(
        private prisma: PrismaService,
        private readonly mailService: MailerService,
    ) {}

    async getCourses() {
        try {
            const courses = await this.prisma.course.findMany({})

            return courses
        } catch (error) {
            console.error('getCourses', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
            throw error
        }
    }

    async getUsersInCourse(courseId: number) {
        try {
            const connections = await this.prisma.courseToUser.findMany({
                where: {
                    courseId: courseId,
                },
            })

            const users = await connections.reduce(
                async (results: any, curr) => {
                    const res = await results

                    const user = await this.prisma.user.findUnique({
                        where: {
                            id: curr.userId,
                        },
                        select: {
                            email: true,
                            firstName: true,
                            lastName: true,
                            id: true,
                            role: true,
                        },
                    })

                    res.push(user)

                    return res
                },
                [],
            )

            return users
        } catch (error) {
            console.error('getUsersInCourse', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
            throw error
        }
    }

    async getCourseById(courseId: number) {
        try {
            const course = await this.prisma.course.findFirstOrThrow({
                where: {
                    id: courseId,
                },
            })
            return course
        } catch (error) {
            console.error('getCourseById', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
            throw error
        }
    }

    async getOwnedCourses(ownerId: number) {
        try {
            const owned = await this.prisma.course.findMany({
                where: {
                    ownerId: ownerId,
                },
            })

            return owned
        } catch (error) {
            console.error('getOwnedCourses', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
            throw error
        }
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

            return userCourses
        } catch (error) {
            console.error('getUserCourses', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
            throw error
        }
    }

    async addUserToCourse(courseId: number, userId: number) {
        try {
            const response = await this.prisma.courseToUser.create({
                data: {
                    userId,
                    courseId,
                },
                select: {
                    course: true,
                    user: true,
                },
            })

            await this.mailService.sendMail({
                to: response.user.email,
                subject: `Kurzus hozzárendelés: ${response.course.name}`,
                text: `Hozzálettél rendelve ehhez a kurzushoz: ${response.course.name}`,
            })
        } catch (error) {
            console.error('addUserToCourse', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
            throw error
        }
    }
    async deleteUserFromCourse(courseId: number, userId: number) {
        try {
            await this.prisma.courseToUser.deleteMany({
                where: {
                    userId: userId,
                    courseId: courseId,
                },
            })
        } catch (error) {
            console.error('deleteUserFromCourse', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
            throw error
        }
    }

    async insertCourse(dto: InsertCourseDto, ownerId: number) {
        try {
            const response = await this.prisma.course.create({
                data: { ...dto, ownerId },
            })

            return response
        } catch (error) {
            console.error('insertCourse', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
            throw error
        }
    }

    async deleteCourse(courseId: number) {
        try {
            await this.prisma.course.delete({
                where: {
                    id: courseId,
                },
            })
        } catch (error) {
            console.error('deleteCourse', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
            throw error
        }
    }

    async updateCourse(courseId: number, dto: InsertCourseDto) {
        try {
            return await this.prisma.course.update({
                where: {
                    id: courseId,
                },
                data: dto,
            })
        } catch (error) {
            console.error('updateCourse', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }
            throw error
        }
    }
}
