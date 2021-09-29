import {
  Controller,
  Get,
  Headers,
  Post,
  Body
} from "@nestjs/common";
import { Magento2Service } from "./magento2/magento2.service";
import { MAGENTO2 } from "./constant";

@Controller("cashier")
export class AppController {
  constructor(private readonly magento2Service: Magento2Service) {}

  @Post("login")
  loginCashier(
    @Headers() headers: { platform: string; url: string },
    @Body() body: { username: string; password: string }
  ): any {
    const payload = {
      username: body.username,
      password: body.password,
      url: headers.url,
    };
    switch (headers.platform) {
      case MAGENTO2:
        return this.magento2Service.loginCashierService(payload);
      default:
        return;
    }
  }

  @Get("shop-info")
  shopInfo(
    @Headers() headers: { platform: string; token: string; url: string }
  ): any {
    switch (headers.platform) {
      case MAGENTO2:
        return this.magento2Service.shopInfoService(headers);
      default:
        break;
    }
  }
}
