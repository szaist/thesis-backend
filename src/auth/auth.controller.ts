import { Controller, Post } from '@nestjs/common'
import { Body } from '@nestjs/common/decorators'
import { AuthService } from './auth.service'
import { AuthDto, RegisterDto } from './dto'
import { Public } from './decorator/public.decorator'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { ChangePasswordDto } from './dto/change-password.dto'

@Public()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() dto: RegisterDto) {
        return this.authService.signup(dto)
    }

    @Post('signin')
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto)
    }

    @Post('forgot-password')
    forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(dto)
    }

    @Post('change-password')
    changePassword(@Body() dto: ChangePasswordDto) {
        return this.authService.changePassword(dto)
    }
}
