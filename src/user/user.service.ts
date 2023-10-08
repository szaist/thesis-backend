import { PrismaService } from 'src/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { Errors } from 'src/prisma/errors'
import { Prisma, ROLE } from '@prisma/client'

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async findById(userId: number) {
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    id: userId,
                },
            })

            return { data: user }
        } catch (error) {
            console.error('findById', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }

            throw error
        }
    }

    async getAll() {
        try {
            const users = await this.prisma.user.findMany()

            return { data: users }
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }

            throw error
        }
    }

    async getByRole(role: ROLE) {
        try {
            const users = await this.prisma.user.findMany({
                where: {
                    role: ROLE[role],
                },
            })

            return users
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw Errors.codes[error.code]
            }

            throw error
        }
    }
}
