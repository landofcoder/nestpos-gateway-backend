import {Resolver, Query, Args, Mutation} from '@nestjs/graphql';
import {GwTransactionService} from "./gw-transaction.service";
import {GwTransaction} from "../entities/gw-transaction.entity";

@Resolver('GwTransaction')
export class GwTransactionResolver {
    constructor(private readonly gwTransactionService: GwTransactionService) {
    }

    /**
     * Get all app by userId
     * @param userId
     * @param membership_id
     * @param status
     */
    @Query(() => [GwTransaction])
    async getTransactions(
        @Args('userId') userId: string,
        @Args('membership_id') membership_id: string,
        @Args('status') status: string
        ) {
        return this.gwTransactionService.findAll(userId, membership_id, status);
    }

    /**
     * Create new transaction
     * @param membershipId
     */
    @Mutation()
    async subscribeMembership(@Args('membershipId') membershipId: string, @Args('userId') userId: string) {
        return this.gwTransactionService.subscribeMembership(membershipId, userId);
    }
}
