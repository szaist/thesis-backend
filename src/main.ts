import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bodyParser: true })

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    app.enableCors()

    await app.listen(3333)
}
bootstrap()
