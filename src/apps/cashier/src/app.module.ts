import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import { Magento2Service } from './magento2/magento2.service';
import { LoginCashierResolver } from './magento2/login/login.resolver';
import { CustomerCheckoutModule } from './customer-checkout/customer-checkout.module';
import { CustomerModule } from './customer/customer.module';

@Module({
    imports: [CustomerCheckoutModule, CustomerModule],
    controllers: [AppController],
    providers: [Magento2Service, LoginCashierResolver],
})

export class AppModule {
}