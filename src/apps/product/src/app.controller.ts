import {Magento2Service} from "./magento2/magento2.service";
import {Controller, Get, Headers, Post, Body, Param} from "@nestjs/common";
import {MAGENTO2} from "./constant";

@Controller("product")
export class AppController {
    constructor(private readonly magento2Service: Magento2Service) {
    }

    @Get()
    getHello(): string {
        return "Hello world";
    }

    @Post("create-custom-product")
    async createCustomProduct(
        @Headers() headers: { platform: string; url: string; token: string },
        @Body() body: any
    ): Promise<string> {
        const appInfo = {token: headers.token, url: headers.url};
        const params = body.payload;
        switch (headers.platform) {
            case MAGENTO2:
                return this.magento2Service.createCustomerProduct(appInfo, params);
            default:
                break;
        }
    }

    @Get("sync-bar-code/:itemPerPage/:currentPage")
    async syncBarCode(
        @Headers() headers: { platform: string; url: string; token: string },
        @Param() params
    ): Promise<string> {
        const payload = {
            token: headers.token,
            url: headers.url,
            itemPerPage: params.itemPerPage,
            currentPage: params.currentPage,
        };
        switch (headers.platform) {
            case MAGENTO2:
                return await this.magento2Service.getAllBarCodeInventory(payload);
            default:
                break;
        }
    }

    @Get("sync-inventory/:itemPerPage/:currentPage")
    async syncProductInventory(
        @Headers() headers: { platform: string; url: string; token: string },
        @Param() params
    ): Promise<string> {
        const payload = {
            token: headers.token,
            url: headers.url,
            itemPerPage: params.itemPerPage,
            currentPage: params.currentPage,
        };
        switch (headers.platform) {
            case MAGENTO2:
                return await this.magento2Service.getProductInventoryByWareHouse(payload);
            default:
                break;
        }
    }
}
