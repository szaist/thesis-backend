import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDto, RegisterDto } from './dto'
import * as argon from 'argon2'
import { Prisma } from '@prisma/client'
import { JwtService } from '@nestjs/jwt/dist'
import { ConfigService } from '@nestjs/config/dist'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { MailerService } from '@nestjs-modules/mailer'
import { ChangePasswordDto } from './dto/change-password.dto'

interface JwtTokenPayload {
    id: number
}

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
        private readonly mailService: MailerService,
    ) {}
    async signup(dto: RegisterDto) {
        const hash = await argon.hash(dto.password)

        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    hash,
                },
            })
            delete user.hash

            return { data: user }
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken')
                }
            }
            throw error
        }
    }

    async signin(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        })

        if (!user) throw new ForbiddenException('Credentials incorrect!')

        const pwMatches = await argon.verify(user.hash, dto.password)

        if (!pwMatches) throw new ForbiddenException('Credentials incorrect!')

        return this.signToken(user.id, user.email)
    }

    async signToken(
        userId: number,
        email: string,
    ): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email,
        }

        const secret = this.config.get('JWT_SECRET')
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '1d',
            secret,
        })

        return {
            access_token: token,
        }
    }

    async forgotPassword(dto: ForgotPasswordDto) {
        try {
            const user = await this.prisma.user.findFirstOrThrow({
                where: {
                    email: dto.email,
                },
            })

            const token = await this.jwt.signAsync(
                { id: user.id },
                {
                    secret: this.config.get('JWT_SECRET'),
                    expiresIn: '10m',
                },
            )

            const frontendUrl = this.config.get('FRONTEND_URL')

            await this.mailService.sendMail({
                to: dto.email,
                subject: 'Reset password',
                text: `There is your reset password link: ${frontendUrl}/auth/forgot-password/${user.id}/${token}`,
            })
        } catch (error) {
            console.log(error)
        }
    }

    async changePassword(dto: ChangePasswordDto) {
        const { token } = dto

        try {
            const userData = this.jwt.verify(token, {
                secret: this.config.get('JWT_SECRET'),
            }) as JwtTokenPayload

            if (userData) {
                const newHashedPassword = await argon.hash(dto.password)

                await this.prisma.user.update({
                    where: {
                        id: userData.id,
                    },
                    data: {
                        hash: newHashedPassword,
                    },
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
}
