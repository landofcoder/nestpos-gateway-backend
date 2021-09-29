import { Body, Controller, Get, Headers, Query, Post } from "@nestjs/common";
import { MAGENTO2 } from "../constant";
import { Magento2CheckoutService } from "./magento2-checkout/magento2-checkout.service";

@Controller("cashier/customer-checkout")
export class CustomerCheckoutController {
  constructor(
    private readonly magento2CheckoutService: Magento2CheckoutService
  ) {}

  /**
   * Get discount by quote
   * @param headers
   * @param body
   */
  @Post("get-discount-quote")
  getDiscountCart(
    @Headers() headers: { platform: string; token: string; url: string },
    @Body() body: { params: string }
  ): any {
    const payload = { params: body.params, headers };
    switch (headers.platform) {
      case MAGENTO2:
        return this.magento2CheckoutService.getDiscountCart(payload);
      default:
        break;
    }
  }

  @Post("sync-up-order")
  syncUpOrder(
    @Headers() headers: { platform: string; token: string; url: string },
    @Body() body: { params: string }
  ): any {
    const payload = { params: body.params, headers };
    switch (headers.platform) {
      case MAGENTO2:
        return this.magento2CheckoutService.syncUpOrder(payload);
      default:
        break;
    }
  }

  @Post("sync-down-order")
  syncDownOrder(
    @Headers() headers: { platform: string; token: string; url: string },
    @Body() body: { params: { orderId: string } }
  ): any {
    console.log(body);
    const payload = { params: body.params, headers };
    switch (headers.platform) {
      case MAGENTO2:
        return this.magento2CheckoutService.syncDownOrder(payload);
      default:
        break;
    }
  }
  @Get("reward-points-info")
  getRewardPointsInfo(
    @Query("customerId") customerId,
    @Headers() headers: { platform: string; token: string; url: string }
  ): any {
    switch (headers.platform) {
      case MAGENTO2:
        const payload = { headers, params: { customerId } };
        return this.magento2CheckoutService.getRewardPointInfo(payload);
      default:
        break;
    }
  }

  @Get("get-list-order-history")
  getListOrderHistory(
    @Headers() headers: { platform: string; token: string; url: string }
  ): any {
    const payload = { headers };
    switch (headers.platform) {
      case MAGENTO2:
        return this.magento2CheckoutService.getListOrderHistory(payload);
      default:
        break;
    }
    return;
  }

  @Post("get-action-order")
  getActionOrder(
    @Headers() headers: { platform: string; token: string; url: string },
    @Body() body: { params: any }
  ): Promise<string> {
    const { params } = body;
    let payload = { type: null, data: null, headers };
    try {
      const { type, data } = params;
      payload.type = type;
      payload.data = data;
    } catch (err) {}

    switch (headers.platform) {
      case MAGENTO2:
        return this.magento2CheckoutService.getActionOrder(payload);
      default:
        return null;
    }
  }

  @Post("set-action-order")
  setActionOrder(
    @Headers() headers: { platform: string; token: string; url: string },
    @Body() body: { params: any }
  ): Promise<string> {
    const { params } = body;
    let payload = { type: null, data: null, headers };
    try {
      const { type, data } = params;
      payload.type = type;
      payload.data = data;
    } catch (err) {}

    switch (headers.platform) {
      case MAGENTO2:
        return this.magento2CheckoutService.setActionOrder(payload);
      default:
        return null;
    }
  }
}
