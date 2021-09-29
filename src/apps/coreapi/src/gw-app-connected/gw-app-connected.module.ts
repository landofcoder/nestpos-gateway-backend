import {Module} from '@nestjs/common';
import {GwAppConnectedResolver} from './gw-app-connected.resolver';
import {GwAppConnectedService} from './gw-app-connected.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {GwAppConnected} from '../entities/gw-app-connected.entity';
import {GwUsers} from '../entities/gw-users.entity';

@Module({
    imports: [TypeOrmModule.forFeature([GwAppConnected, GwUsers])],
    providers: [GwAppConnectedResolver, GwAppConnectedService]
})
export class GwAppConnectedModule {
}
