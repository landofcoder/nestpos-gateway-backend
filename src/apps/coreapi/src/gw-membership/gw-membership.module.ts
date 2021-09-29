import {Module} from '@nestjs/common';
import {GwMembershipResolver} from './gw-membership.resolver';
import {GwMembershipService} from './gw-membership.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {GwMembership} from '../entities/gw-membership.entity';
import {GwUsers} from '../entities/gw-users.entity';

@Module({
    imports: [TypeOrmModule.forFeature([GwMembership, GwUsers])],
    providers: [GwMembershipResolver, GwMembershipService]
})
export class GwMembershipModule {
}
