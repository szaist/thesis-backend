import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { QuestionModule } from './question/question.module'
import { AnswerModule } from './answer/answer.module'
import { TestModule } from './test/test.module'
import { PrismaModule } from './prisma/prisma.module'
import { CourseModule } from './course/course.module'
import { FillingTestModule } from './filling-test/filling-test.module'
import { UpcomingtestModule } from './upcomingtest/upcomingtest.module'
import { UserService } from './user/user.service'
import { APP_GUARD } from '@nestjs/core'
import { JwtGuard } from './auth/guard'
import { MailerModule } from '@nestjs-modules/mailer'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD,
                    },
                    tls: {
                        rejectUnauthorized: false,
                    },
                },
                defaults: {
                    from: 'TestMaker <testmaker202301@gmail.com>',
                },
            }),
        }),
        AuthModule,
        UserModule,
        QuestionModule,
        AnswerModule,
        TestModule,
        PrismaModule,
        CourseModule,
        FillingTestModule,
        UpcomingtestModule,
    ],
    providers: [UserService, { provide: APP_GUARD, useClass: JwtGuard }],
})
export class AppModule {}
