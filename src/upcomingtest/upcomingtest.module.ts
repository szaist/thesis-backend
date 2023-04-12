import { Module } from '@nestjs/common'
import { UpcomingtestService } from './upcomingtest.service'
import { UpcomingtestController } from './upcomingtest.controller'

@Module({
    controllers: [UpcomingtestController],
    providers: [UpcomingtestService],
})
export class UpcomingtestModule {}
