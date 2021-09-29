import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {AppService} from './app.service';

@Controller('coreapi')
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get('forgot-password/:email')
    async forgotPassword(@Param('email') email: string): Promise<boolean> {
        return this.appService.forgotPassword(email);
    }

    @Get('get-forgot-item/:token')
    async getForgotByToken(@Param('token') token: string): Promise<any> {
        return this.appService.getForgotByToken(token);
    }

    @Get('check-license/:token/:version')
    async checkLicense(@Param('token') token: string,
                       @Param('version') version: string): Promise<string> {
        return this.appService.checkLicense(token, version);
    }

    @Post('reset-password-request')
    async resetPasswordRequest(@Body() body: { token: string; password: string }): Promise<boolean> {
        return this.appService.resetPasswordRequest(body.token, body.password);
    }

    /**
     * Reset password from dashboard with logged user
     * @param body
     */
    @Post('change-password')
    async changePasswordFromProfile(@Body() body: { password: string; email: string }): Promise<boolean> {
        return this.appService.changePasswordFromProfile(body.password, body.email);
    }

    /**
     * Reset password from dashboard with logged user
     * @param body
     */
    @Post('save-profile')
    async saveProfile(@Body() body: { firstName: string; lastName: string; email: string }): Promise<boolean> {
        return this.appService.saveProfile(body.firstName, body.lastName, body.email);
    }
}
