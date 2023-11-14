import {
    Body,
    Controller,
    Delete,
    Get,
    Header,
    HttpStatus,
    Param,
    Patch,
    Post,
    StreamableFile,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { ParseFilePipeBuilder, ParseIntPipe } from '@nestjs/common/pipes'
import { InsertQuestionDto } from './dto'
import { QuestionService } from './question.service'
import { RolesGuard } from 'src/auth/guard'
import { Roles } from 'src/auth/decorator/roles.decorator'
import { ROLE, User } from '@prisma/client'
import { FileInterceptor } from '@nestjs/platform-express'
import { extname, join } from 'path'
import { createReadStream } from 'fs'
import { Public } from 'src/auth/decorator/public.decorator'
import { GetUser } from 'src/auth/decorator'
import { diskStorage } from 'multer'

@UseGuards(RolesGuard)
@Roles(ROLE.STUDENT, ROLE.TEACHER)
@Controller('question')
export class QuestionController {
    constructor(private questionService: QuestionService) {}

    @Get('/test/:id')
    async getQuestionByTest(@Param('id', ParseIntPipe) testId) {
        return this.questionService.getQuestionsByTestId(testId)
    }

    @Public()
    @Get('/image/:filename')
    @Header('Content-Type', 'image/*')
    async getImage(@Param('filename') filename: string) {
        const data = createReadStream(
            join(process.cwd(), '/question-images/', filename),
        )
        return new StreamableFile(data)
    }

    @Get('/:id')
    async getQuestion(@Param('id', ParseIntPipe) questionId) {
        return this.questionService.getQuestionById(questionId)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Post('/image/:questionId')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './question-images',
                filename(req, file, callback) {
                    const suffix =
                        Date.now() + '-' + Math.round(Math.random() * 1e8)

                    const extension = extname(file.originalname)

                    const fileName = `${suffix}${extension}`

                    callback(null, fileName)
                },
            }),
        }),
    )
    async upsertQuestionImage(
        @Param('questionId', ParseIntPipe) questionId: number,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: '.(png|jpeg|jpg)',
                })
                .addMaxSizeValidator({
                    maxSize: 5000000,
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                }),
        )
        image: Express.Multer.File,
        @GetUser() user: User,
    ) {
        return this.questionService.upsertQuestionImage(
            `question-images/${image.filename}`,
            questionId,
            user.id,
        )
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Post()
    async insertQuestion(@Body() dto: InsertQuestionDto) {
        return this.questionService.insertQuestion(dto)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Delete('/:id')
    async deleteQuestion(@Param('id', ParseIntPipe) questionId: number) {
        return this.questionService.deleteQuestion(questionId)
    }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Patch('/:id')
    async updateQuestion(
        @Param('id', ParseIntPipe) questionId,
        @Body() dto: InsertQuestionDto,
    ) {
        return this.questionService.updateQuestion(questionId, dto)
    }
}
