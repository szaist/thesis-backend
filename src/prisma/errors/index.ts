import { BadRequestException } from '@nestjs/common'

export class Errors {
    public static codes = {
        P2002: new BadRequestException('Already exists with this id'),
        P2003: new BadRequestException('Id doesnt exists.'),
        P2025: new BadRequestException('Record does not exist.'),
    }
}
