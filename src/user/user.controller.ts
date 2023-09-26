import { Controller, Get, UseGuards } from '@nestjs/common'
import { GetUser } from 'src/auth/decorator'
import { JwtGuard } from 'src/auth/guard'
import { ROLE, User } from '@prisma/client'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
    constructor(private userService:UserService) {}

    @UseGuards(JwtGuard)
    @Get('/me')
    getMe(@GetUser() user: User) {
        return user
    }

    @Get()
    async getAllUser() {
        return await this.userService.getAll()
    }
    @Get('/students')
    async getStudents() {
        return await this.userService.getByRole(ROLE.STUDENT)
    }
}
