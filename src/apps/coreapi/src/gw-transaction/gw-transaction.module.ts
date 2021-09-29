import {Module} from '@nestjs/common';
import {GwTransactionResolver} from './gw-transaction.resolver';
import {GwTransactionService} from './gw-transaction.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {GwTransaction} from '../entities/gw-transaction.entity';
import {GwUsers} from '../entities/gw-users.entity';
import {GwMembership} from '../entities/gw-membership.entity';

@Module({
    imports: [TypeOrmModule.forFeature([GwTransaction, GwUsers, GwMembership])],
    providers: [GwTransactionResolver, GwTransactionService]
})
export class GwTransactionModule {
}
