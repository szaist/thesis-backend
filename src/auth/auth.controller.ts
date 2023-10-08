import { Controller, HttpStatus, Post } from '@nestjs/common'
import { Body, HttpCode } from '@nestjs/common/decorators'
import { AuthService } from './auth.service'
import { AuthDto } from './dto'
import { Public } from './decorator/public.decorator'

@Public()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() dto: AuthDto) {
        return this.authService.signup(dto)
    }

    @Post('signin')
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto)
    }
}
