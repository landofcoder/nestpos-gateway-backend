import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {GraphQLFederationModule} from "@nestjs/graphql";
import {GwAppConnected} from "./entities/gw-app-connected.entity";
import {GwUsers} from "./entities/gw-users.entity";
import {GwForgotPassword} from "./entities/gw-forgot-password.entity";
import {GwMembership} from "./entities/gw-membership.entity";
import {GwTransaction} from "./entities/gw-transaction.entity";
import {AppService} from './app.service';
import {AppController} from './app.controller';
import {GwAppConnectedModule} from "./gw-app-connected/gw-app-connected.module";
import {GwMembershipModule} from "./gw-membership/gw-membership.module";
import {GwTransactionModule} from "./gw-transaction/gw-transaction.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([GwAppConnected, GwUsers, GwForgotPassword, GwTransaction, GwMembership]),
        GraphQLFederationModule.forRoot({
            typePaths: ["**/*.graphql"],
            path: 'coreapi/graphql'
        }),
        TypeOrmModule.forRoot({
            type: 'mongodb',
            host: 'mongo',
            database: 'pos-gateway',
            entities: [GwAppConnected, GwUsers, GwForgotPassword, GwTransaction, GwMembership],
            synchronize: true
        }),
        GwAppConnectedModule,
        GwMembershipModule,
        GwTransactionModule
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule {
}
