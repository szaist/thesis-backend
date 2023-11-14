import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as bodyParser from 'body-parser'
import multer from 'multer'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bodyParser: true })

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    app.enableCors()

    app.use(multer)
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    await app.listen(3333)
}
bootstrap()
