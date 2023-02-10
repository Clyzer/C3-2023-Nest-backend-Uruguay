import { Body, Post, Controller, Query, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SecurityService } from '../../business/services';
import { SignInDto, SignUpDto } from '../../business/dtos';
import { LoginResponseModel } from '../../data';

@ApiTags('security')
@Controller('api/security')
export class SecurityController {

    constructor(private readonly securityService: SecurityService) {}

    @Post('/sign-up')
    signUp(@Body() signUp: SignUpDto): LoginResponseModel {
        return this.securityService.signUp(signUp);
    }

    @Post('/sign-in')
    signIn(@Body() signIn: SignInDto): LoginResponseModel {
        return this.securityService.signIn(signIn);
    }

    @Get('/is-valid')
    isValid(@Query('jwtToken') jwtToken: string): string {
        return this.securityService.isValid(jwtToken);
    }

}