import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
import { Magento2CustomerService } from "./magento2-customer/magento2-customer.service";
import { MAGENTO2 } from "../constant";

@Controller("cashier/customer")
export class CustomerController {
  constructor(
    private readonly magento2CustomerService: Magento2CustomerService
  ) {}

  @Post("search-customer-by-name")
  searchCustomerByName(
    @Headers() headers: { platform: string; token: string; url: string },
    @Body() body: { searchValue: string }
  ) {
    const payload = { searchValue: body.searchValue };
    switch (headers.platform) {
      case MAGENTO2:
        return this.magento2CustomerService.searchCustomerByName(
          headers,
          payload
        );
      default:
        break;
    }
  }

  /**
   * Search by customer-id or email for MAGENTO2
   * @param headers
   * @param body
   */
  @Post("search-customer")
  searchCustomer(
    @Headers() headers: { platform: string; token: string; url: string },
    @Body() body: { searchValue: string }
  ) {
    const payload = { searchValue: body.searchValue };
    switch (headers.platform) {
      case MAGENTO2:
        return this.magento2CustomerService.searchCustomer(headers, payload);
      default:
        break;
    }
  }

  /**
   * Search by customer-id or email for MAGENTO2
   * @param headers
   * @param body
   */
  @Post("create-customer")
  createCustomer(
    @Headers() headers: { platform: string; token: string; url: string },
    @Body()
    body: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }
  ) {
    switch (headers.platform) {
      case MAGENTO2:
        return this.magento2CustomerService.createCustomer(headers, {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          password: body.password
        });
      default:
        break;
    }
  }
}
