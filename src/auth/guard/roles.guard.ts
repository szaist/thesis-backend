import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserService } from '../../user/user.service'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private userService: UserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ])

        if (isPublic) {
            return true
        }

        const roles = this.reflector.get<string[]>(
            'roles',
            context.getHandler(),
        )

        if (!roles) return true

        const request = context.switchToHttp().getRequest()

        if (request?.user) {
            const { id } = request.user

            const user = await this.userService.findById(id)

            return roles.includes(user.role)
        }

        return false
    }
}
