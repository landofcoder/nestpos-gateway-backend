import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {GraphQLFederationModule} from "@nestjs/graphql";
import {ProductsResolvers} from "./products.resolver";
import { Magento2Service } from './magento2/magento2.service';

@Module({
    imports: [
        GraphQLFederationModule.forRoot({
            typePaths: ["**/*.graphql"],
            path: 'product/graphql',
            context: ({req}) => ({...req})
        })
    ],
    controllers: [AppController],
    providers: [ProductsResolvers, Magento2Service],
})
export class AppModule {
}
