import {Injectable} from '@nestjs/common';
import {GwMembership} from "../entities/gw-membership.entity";
import {GwUsers} from "../entities/gw-users.entity";
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {MAGENTO2} from '../constant';
import {v4 as uuidv4} from 'uuid';

const bcrypt = require('bcryptjs');

@Injectable()
export class GwMembershipService {
    constructor(
        @InjectRepository(GwMembership) private readonly gwMembershipMongoRepository: Repository<GwMembership>,
        @InjectRepository(GwUsers) private readonly  gwUsersEntity: Repository<GwUsers>
    ) {
    }

    async getMembership(_id: string): Promise<GwMembership> {
        return this.gwMembershipMongoRepository.findOne({where: {_id}});
    }

    async getAllMembership(is_featured: string): Promise<GwMembership[]> {
        return this.gwMembershipMongoRepository.find({where: {is_featured: is_featured}, order: {_id: 'DESC'}});
    }
}
