import { BadRequestException } from '@nestjs/common'

export class Errors {
    public static codes = {
        P2003: new BadRequestException('Id doesnt exists.'),
        P2025: new BadRequestException('Record does not exist.'),
    }
}
