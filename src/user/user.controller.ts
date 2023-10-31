import { Controller, Get, UseGuards } from '@nestjs/common'
import { GetUser } from 'src/auth/decorator'
import { JwtGuard, RolesGuard } from 'src/auth/guard'
import { ROLE, User } from '@prisma/client'
import { UserService } from './user.service'
import { Roles } from 'src/auth/decorator/roles.decorator'

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtGuard)
    @Get('/me')
    getMe(@GetUser() user: User) {
        return user
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Get()
    async getAllUser() {
        return await this.userService.getAll()
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Get('/students')
    async getStudents() {
        return await this.userService.getByRole(ROLE.STUDENT)
    }
}
