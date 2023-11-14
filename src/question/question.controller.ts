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
import { join } from 'path'
import { createReadStream } from 'fs'
import { ConfigService } from '@nestjs/config'
import { Public } from 'src/auth/decorator/public.decorator'
import { GetUser } from 'src/auth/decorator'

@UseGuards(RolesGuard)
@Roles(ROLE.STUDENT, ROLE.TEACHER)
@Controller('question')
export class QuestionController {
    constructor(
        private questionService: QuestionService,
        private configService: ConfigService,
    ) {}

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

    // @UseGuards(RolesGuard)
    // @Roles(ROLE.TEACHER)
    // @Post('/image/:questionId')
    // async upsertQuestionImage(
    //     @Param('questionId', ParseIntPipe) questionId: number,

    //     @GetUser() user: User,
    //     @Body() body: any,
    // ) {
    //     console.log(body)
    //     return this.questionService.upsertQuestionImage(
    //         `question-images/${file.filename}`,
    //         questionId,
    //         user.id,
    //     )
    // }

    @UseGuards(RolesGuard)
    @Roles(ROLE.TEACHER)
    @Post()
    // @UseInterceptors(
    //     FileInterceptor('image', {
    //         storage: diskStorage({
    //             destination: './question-images',
    //             filename: (req, file, callback) => {
    //                 const suffix =
    //                     Date.now() + '-' + Math.round(Math.random() * 1e9)

    //                 const extension = extname(file.originalname)

    //                 const fileName = `${suffix}${extension}`

    //                 callback(null, fileName)
    //             },
    //         }),
    //     }),
    // )
    // @FormDataRequest({
    //     storage: FileSystemStoredFile,
    //     fileSystemStoragePath: '/question-images',
    //     autoDeleteFile: false,
    // })
    @UseInterceptors(FileInterceptor('image'))
    async insertQuestion(
        @Body() dto: InsertQuestionDto,
        @GetUser() user: User,
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
        image?: Express.Multer.File,
    ) {
        return this.questionService.insertQuestion(dto, user.id, image)
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
