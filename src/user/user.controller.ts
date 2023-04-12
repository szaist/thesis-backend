import { Controller, Get, UseGuards } from '@nestjs/common'
import { GetUser } from 'src/auth/decorator'
import { JwtGuard } from 'src/auth/guard'
import { User } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('users')
export class UserController {
    constructor(private prisma: PrismaService) {}

    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@GetUser() user: User) {
        return user
    }

    @Get()
    async getAllUser() {
        return await this.prisma.user.findMany({})
    }
}
