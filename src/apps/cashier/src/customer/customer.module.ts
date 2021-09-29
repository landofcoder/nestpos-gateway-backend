import { Module } from '@nestjs/common';
import { Magento2CustomerService } from './magento2-customer/magento2-customer.service';
import { CustomerController } from './customer.controller';

@Module({
  providers: [Magento2CustomerService],
  controllers: [CustomerController]
})
export class CustomerModule {}
