import {Injectable} from '@nestjs/common';
import {GwTransaction} from "../entities/gw-transaction.entity";
import {GwMembership} from "../entities/gw-membership.entity";
import {GwUsers} from "../entities/gw-users.entity";
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {MAGENTO2} from '../constant';
import {v4 as uuidv4} from 'uuid';

const bcrypt = require('bcryptjs');

@Injectable()
export class GwTransactionService {
    constructor(
        @InjectRepository(GwTransaction) private readonly gwTransactionMongoRepository: Repository<GwTransaction>,
        @InjectRepository(GwUsers) private readonly  gwUsersEntity: Repository<GwUsers>,
        @InjectRepository(GwMembership) private readonly  gwMembershipEntity: Repository<GwMembership>
    ) {
    }

    async findAll(userId: string, membership_id: string, status: string): Promise<GwTransaction[]> {
        let filterParams = {
            user_id: userId
        }
        if(membership_id){
            filterParams["membership_id"] = membership_id
        }
        if(status){
            filterParams["status"] = status
        }
        return this.gwTransactionMongoRepository.find({where: filterParams, order: {_id: 'DESC'}});
    }

    async subscribeMembership(membershipId: string, userId: string) {
        const userProfile = await this.gwUsersEntity.findOne({where: {_id: userId }})
        const membershipPlan = await this.gwMembershipEntity.findOne({where: {_id: membershipId}})
        console.log(">>> membershipPlan", membershipPlan)
        let result = null
        if(userProfile && membershipPlan){
            if(userProfile.plan === "TRIAL" || (userProfile.membership_id !== undefined && userProfile.membership_id !== membershipPlan._id)){
                const obj = {
                    updated_at: new Date(),
                    membership_id: membershipPlan._id,
                    plan: 'TRIAL'
                }
                const isUpdated = await this.gwUsersEntity.update(userId, obj);
                const transactionObj = {
                    name: membershipPlan.name || "Trial",
                    membership_id: membershipId,
                    total: membershipPlan.price || "0.000",
                    paid_price: "0.000",
                    status: "Pending",
                    payment_name: "Credit",
                    transaction_details: "",
                    user_id: userId,
                    created_at: new Date(),
                    updated_at: new Date()
                }
                result = await this.gwTransactionMongoRepository.insert(transactionObj);
            }
        }
        
        return !!result;
    }
}
