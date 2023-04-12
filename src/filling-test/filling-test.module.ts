import { Module } from '@nestjs/common'
import { FillingTestService } from './filling-test.service'

@Module({
    providers: [FillingTestService],
})
export class FillingTestModule {}
