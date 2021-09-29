import {Controller, Get, Headers} from '@nestjs/common';
import {Magento2Service} from "./magento2/magento2.service";
import {MAGENTO2} from "./constant";

@Controller('category')
export class AppController {

    constructor(private readonly magento2Service: Magento2Service) {
    }

    @Get('get-all')
    async getAllCategories(@Headers() headers: { platform: string, url: string, token: string }): Promise<string> {
        const payload = {token: headers.token, url: headers.url};
        switch (headers.platform) {
            case MAGENTO2:
                return this.magento2Service.getAllCategories(payload);
            default:
                break;
        }
    }
}