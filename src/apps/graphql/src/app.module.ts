import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {GraphQLGatewayModule} from '@nestjs/graphql';

@Module({
    imports: [
        GraphQLGatewayModule.forRoot({
            server: {
                cors: true,
                debug: true
            },
            gateway: {
                serviceList: [
                    {name: 'product', url: 'http://node-product:3000/product/graphql'},
                    {name: 'gw-app-connected', url: 'http://node-core-api:3000/coreapi/graphql'}
                ],
                serviceHealthCheck: true
            },
        })
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
