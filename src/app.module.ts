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
import { UpcomingtestModule } from './upcomingtest/upcomingtest.module';
import { UserService } from './user/user.service'
import { APP_GUARD } from '@nestjs/core'
import { JwtGuard } from './auth/guard'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
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
    providers: [
        UserService,
        { provide: APP_GUARD, useClass: JwtGuard }
    ]
})
export class AppModule {}
