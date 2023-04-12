import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { QuestionModule } from './question/question.module'
import { AnswerModule } from './answer/answer.module'
import { TestModule } from './test/test.module'
import { PrismaModule } from './prisma/prisma.module'
import { UpcomingtestController } from './upcomingtest/upcomingtest.controller';
import { UpcomingtestService } from './upcomingtest/upcomingtest.service';
import { CourseService } from './course/course.service';
import { CourseController } from './course/course.controller';
import { CourseModule } from './course/course.module';

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
    ],
    controllers: [UpcomingtestController, CourseController],
    providers: [UpcomingtestService, CourseService],
})
export class AppModule {}
