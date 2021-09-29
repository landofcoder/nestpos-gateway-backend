import { Module } from '@nestjs/common';
import { CustomerCheckoutController } from './customer-checkout.controller';
import { Magento2CheckoutService } from './magento2-checkout/magento2-checkout.service';
import { Magento2CustomerService } from './customer/magento2-customer.service';

@Module({
  controllers: [CustomerCheckoutController],
  providers: [Magento2CheckoutService, Magento2CustomerService]
})
export class CustomerCheckoutModule {}
