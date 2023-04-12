import { Module } from '@nestjs/common'
import { FillingTestService } from './filling-test.service'
import { FillingTestController } from './filling-test.controller'

@Module({
    controllers: [FillingTestController],
    providers: [FillingTestService],
})
export class FillingTestModule {}
